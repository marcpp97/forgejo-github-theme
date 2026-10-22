import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync(new URL("../public/assets/js/actions-run-graph.js", import.meta.url), "utf8");

type Job = { name: string; needs: string[] };
type Node = { name: string; id?: string };
type Graph = {
  parseNeeds: (text: string) => Map<string, Job>;
  layout: (runJobs: { name: string }[], workflow: Map<string, Job>) => { stages: Node[][][]; edges: Node[][] };
  linkPath: (x1: number, y1: number, x2: number, y2: number) => string;
};

function graph(): Graph {
  const window: { themeActionsGraph?: Graph } = {};
  runInNewContext(script, { window });
  return window.themeActionsGraph as Graph;
}

const workflow = `name: Graph
on:
  push:
jobs:
  lint:
    runs-on: docker
    steps:
      - run: echo lint # needs: nothing here
  build:
    name: "Build"
    runs-on: docker
  unit:
    needs: [lint, build]
  e2e:
    needs: build
  deploy:
    needs:
      - unit
      - 'e2e'
    steps:
      - name: needs
        run: echo deploy
env:
  needs: none
`;

const names = (stages: Node[][][]) => stages.map(stage => stage.map(card => card.map(node => node.name)));

describe("Actions run graph", () => {
  it("reads job names and the three ways to write needs", () => {
    const jobs = graph().parseNeeds(workflow);
    expect([...jobs.keys()]).toEqual(["lint", "build", "unit", "e2e", "deploy"]);
    expect(jobs.get("build")).toEqual({ name: "Build", needs: [] });
    expect(jobs.get("unit")?.needs).toEqual(["lint", "build"]);
    expect(jobs.get("e2e")?.needs).toEqual(["build"]);
    expect(jobs.get("deploy")?.needs).toEqual(["unit", "e2e"]);
  });

  it("places jobs in stages after the jobs they need, sorted by name", () => {
    const g = graph();
    const run = ["lint", "Build", "unit", "e2e", "deploy"].map(name => ({ name }));
    const { stages, edges } = g.layout(run, g.parseNeeds(workflow));
    expect(names(stages)).toEqual([[["Build"], ["lint"]], [["e2e"], ["unit"]], [["deploy"]]]);
    expect(edges.map(([from, to]) => `${from.name}>${to.name}`)).toEqual([
      "lint>unit",
      "Build>unit",
      "Build>e2e",
      "unit>deploy",
      "e2e>deploy",
    ]);
  });

  it("puts jobs without links in one card and keeps matrix jobs with their job", () => {
    const g = graph();
    const jobs = g.parseNeeds(
      "jobs:\n  build:\n    runs-on: docker\n  test:\n    needs: build\n  docs:\n    runs-on: docker\n"
    );
    const run = ["build", "docs", "test (1)", "test (2)", "notes"].map(name => ({ name }));
    expect(names(g.layout(run, jobs).stages)).toEqual([
      [["build"], ["docs", "notes"]],
      [["test (1)"], ["test (2)"]],
    ]);
  });

  it("draws GitHub's straight and bent links", () => {
    const { linkPath } = graph();
    expect(linkPath(260, 63, 316, 63)).toBe("M 260 63 H 316");
    expect(linkPath(260, 63, 316, 165)).toBe(
      "M 260 63 H 264 C 276 63 288 75 288 87 V 141 C 288 153 300 165 312 165 H 316"
    );
    expect(linkPath(576, 165, 632, 63)).toBe(
      "M 576 165 H 580 C 592 165 604 153 604 141 V 87 C 604 75 616 63 628 63 H 632"
    );
  });
});

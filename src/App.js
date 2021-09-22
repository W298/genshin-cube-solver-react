import React, { useState } from "react";
import "./App.css";

class Map {
  constructor(ary) {
    this.target = 0;
    this.ary = [];
    this.deep = 0;
    if (ary != null) {
      for (let i = 0; i < ary.length; i++) {
        this.ary.push(new NumberObj(i, ary[i], this));
      }
    }
  }

  get solved() {
    let _solved = true;
    this.ary.forEach((a) => {
      if (a.val != this.target) _solved = false;
    });

    return _solved;
  }

  turn(pos) {
    this.ary[pos].turn();
  }

  print() {
    let str = "";

    for (let i = 0; i < 2; i++) {
      str = str + "[Pos" + i + "]" + this.ary[i].val + "\t";
    }
    str += "\n";
    for (let j = 3; j >= 2; j--) {
      str = str + "[Pos" + j + "]" + this.ary[j].val + "\t";
    }

    console.log(str + "\nTarget : " + this.target);
  }

  copy() {
    let new_ary = [];
    let this_ary = [];
    this.ary.forEach((n) => this_ary.push(n.val));
    Object.assign(new_ary, this_ary);

    let new_map = new Map(new_ary);
    new_map.deep = this.deep;
    new_map.target = this.target;
    return new_map;
  }

  solve(sol = [], solutions) {
    if (this.solved) {
      solutions.push(sol);
    } else {
      for (let i = 0; i < 4; i++) {
        let mt = this.copy();
        mt.turn(i);
        mt.deep++;
        let next_sol = [];
        Object.assign(next_sol, sol);
        next_sol.push(i);
        if (mt.deep < 10) mt.solve(next_sol, solutions);
      }
    }
  }
}

class NumberObj {
  constructor(pos, val, map) {
    this.pos = pos;
    this.val = val;
    this.map = map;
  }

  get adjacent() {
    if (this.pos % 2 == 0) return [1, 3];
    else return [0, 2];
  }

  add() {
    this.val++;
    this.val %= 4;
  }

  turn() {
    this.add();
    this.adjacent.forEach((a) => {
      this.map.ary[a].add();
    });
  }
}

function App() {
  let [result, setResult] = useState([0, 0, 0, 0]);

  function solve() {
    let cubeList = [];
    for (let i = 0; i < 5; i++) {
      cubeList.push(document.querySelector("#cube-" + i));
    }

    let cubeVals = cubeList.map((cube) => {
      if (cube.style.transform === "") return 0;
      else {
        return (Number(cube.style.transform.replace(/[^0-9]/g, "")) / 90) % 4;
      }
    });

    let m = new Map([cubeVals[0], cubeVals[1], cubeVals[4], cubeVals[3]]);
    m.target = cubeVals[2];

    let sols = [];
    m.solve([], sols);

    let minLen = 100;
    let minSol = null;
    sols.forEach((s) => {
      if (s.length < minLen) {
        minLen = s.length;
        minSol = s;
      }
    });

    if (minSol == null || minSol.length === 0) {
      alert("솔루션이 없거나 이미 풀어진 패턴이에요...\n다시 시도해 주세요~");
    } else {
      let result = [];
      for (let i = 0; i < 4; i++) {
        result.push(minSol.filter((element) => i === element).length);
      }

      setResult(result);
    }
  }

  return (
    <div className="App">
      <img
        className="paimon"
        src="https://1.bp.blogspot.com/-XUQcGtlWiE4/X4eYPfgWehI/AAAAAAAATW8/XI9AFnhfUyABHprY7r0Hn2_kNhRb21rFACLcBGAsYHQ/s430/%25EC%259B%2590%25EC%258B%25A0%2B%25EB%2593%25B1%25EC%259E%25A5%25EC%259D%25B8%25EB%25AC%25BC%2B-%2B%25ED%258E%2598%25EC%259D%25B4%25EB%25AA%25AC%2B%2528Paimon%2529_14.png"
      />
      <h1>원신 황해 지하큐브 Solver</h1>
      <h4>
        by 흐무흐무
        <br />
        <br />
        위에서 내려다 봤을 때,
        <br />
        큐브에 그림이 그려져 있는
        <br />
        방향에 맞춰 돌려주세요 (누르면 돌려집니다)
        <br />
        <br />
        때리는 순서는 상관없습니다~
        <br />
      </h4>
      <div className="container">
        <div className="cube-container">
          <Cube id="0" val={result[0]} />
          <Cube id="1" val={result[1]} />
        </div>
        <div className="cube-container">
          <Cube id="2" val={"목표"} />
        </div>
        <div className="cube-container">
          <Cube id="3" val={result[3]} />
          <Cube id="4" val={result[2]} />
        </div>
        <button className="solveBtn" onClick={solve}>
          Solve!
        </button>
      </div>
    </div>
  );
}

function Cube({ id, val }) {
  let [status, setStatus] = useState(0);

  function cubeClick() {
    let self = document.querySelector("#cube-" + id);
    self.style = "transform: rotate(" + (status + 1) * 90 + "deg)";
    setStatus(status + 1);
  }

  return (
    <div className="cube-outer">
      <div className={"cube"} onClick={cubeClick} id={"cube-" + id}>
        <svg viewBox="0 0 32 32" aria-hidden="true" fill="white">
          <path d="M8 20.695l7.997-11.39L24 20.695z" />
        </svg>
      </div>
      <div className="cube-result">
        {val === "목표" ? val : val === 0 ? " " : val + "번 때리기"}
      </div>
    </div>
  );
}

export default App;

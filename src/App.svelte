<script lang="ts">
  import Tailwindcss from "./components/Tailwind.svelte";
  import { board } from "./board";
  import {
    getArea,
    changeWind,
    rollDie,
    initShips,
    relocateShip,
    initForts,
    initArea,
  } from "./utils";
  import ArrowIcon from "./components/ArrowIcon.svelte";
  import { pipe, tupled } from "fp-ts/lib/function";
  import * as O from "fp-ts/lib/Option";
  import { isFortIndex } from "./types";

  let boardState = board;
  let area = initArea();
  let teams = [{ color: "yellow-700" }, { color: "purple-600" }];
  let roll = 6;
  let turn = 0;
  let selectedShipIndex: number | undefined;
  let ships = initShips();
  let forts = initForts({
    95: { team: 0, lastProduced: 0 },
    1272: { team: 1, lastProduced: 0 },
  });
  let windDirection: 0 | 1 | 2 | 3 = 0;

  const endTurn = () => {
    area = [];
    selectedShipIndex = undefined;
    roll = 0;
    turn = (turn + 1) % teams.length;
  };

  const isTurn = ({ team }: { team: number }) => {
    return team === turn;
  };

  const handleMoveShip = (i: number) =>
    pipe(
      i,
      (index): O.Option<[number, number]> =>
        area[index] ? O.some([index, area[index]]) : O.none,
      O.map(
        tupled((newIndex: number, distance: number) => {
          ships = relocateShip(
            selectedShipIndex,
            newIndex,
            turn,
            distance,
            ships
          );
          area = [];
          selectedShipIndex = undefined;
        })
      )
    );

  const showArea = (i: number) => {
    const ship = ships[i];
    if (ship == null || isTurn(ship) === false) {
      return;
    } else if (i === selectedShipIndex) {
      area = [];
      selectedShipIndex = undefined;
      return;
    }
    area = getArea(boardState, windDirection)(i, roll - ship.hasMoved);
    selectedShipIndex = i;
  };

  const onClick = (i: number) => (): void => {
    console.log(i);
    const handleClick = ships[i] ? showArea : handleMoveShip;
    handleClick(i);
  };

  const ioWind = () => {
    windDirection = changeWind();
  };

  const ioRoll = () => {
    roll = rollDie();
  };

  const getTeamColor = (index: number): string => {
    const shipOrFort = isFortIndex(index) ? forts[index] : ships[index];
    if (shipOrFort == null) {
      return "";
    }
    const color = teams[shipOrFort.team]?.color || "gray-800";
    return `bg-${color}`;
  };

  const isAttackable = (i: number): boolean =>
    !!ships[i] && ships[i]?.team !== turn && !!area[i];
</script>

<main class="h-screen">
  <Tailwindcss />
  <div class="flex flex-col justify-center items-center h-full">
    <div class="flex justify-center">
      <div
        on:click={ioWind}
        class={`inline-block`}
        style={`transform: rotate(${windDirection * 90}deg)`}>
        <ArrowIcon />
      </div>
      <div on:click={ioRoll}>{roll}</div>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-wrap" style={`width: ${44}rem`}>
        {#each boardState as { isLand }, i}
          <div
            on:click={onClick(i)}
            class={`${getTeamColor(i) || (area[i] ? `bg-red-${area[i]}00` : !isLand ? 'bg-blue-500' : getTeamColor(i) || 'bg-green-500')} h-4 w-4 border border-blue-600 ${isAttackable(i) ? 'attackable' : ''}`} />

          <!-- <TileComponent {isLand} isShip={false} onClick={onClick(i)} /> -->
        {/each}
      </div>
    </div>
    <button on:click={endTurn}>End Turn</button>
  </div>
</main>

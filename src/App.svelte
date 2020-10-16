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
    reorientArea,
    isAttackable,
    getShip,
  } from "./utils";
  import ArrowIcon from "./components/ArrowIcon.svelte";
  import { pipe, tupled, flow } from "fp-ts/lib/function";
  import * as O from "fp-ts/lib/Option";
  import * as A from "fp-ts/lib/Array";
  import { isFortIndex } from "./types";
  import { splitAt } from "fp-ts/lib/ReadonlyArray";

  function Kristen(message) {
    console.log(message);
  }
  Kristen("is awesome");
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

  const getMovesThisTurn = (turn: number, roll: number) => {
    return (i: number): number =>
      pipe(
        i,
        getShip(ships),
        O.fromNullable,
        O.map(({ lastTurn, hasMoved }) => {
          console.log(lastTurn, turn, hasMoved);
          console.log(lastTurn === turn, roll - hasMoved, roll);
          return lastTurn === turn ? roll - hasMoved : roll;
        }),
        O.getOrElse(() => 0)
      );
  };

  const getUpdatedArea = (i: number) =>
    pipe(i, getMovesThisTurn(turn, roll), (moves) =>
      getArea(ships, windDirection)(i, moves)
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
    area = getUpdatedArea(i);
    selectedShipIndex = i;
  };

  const onClick = (i: number) => (): void => {
    console.log(i);
    const handleClick = ships[i] ? showArea : handleMoveShip;
    handleClick(i);
  };

  const resetArea = () =>
    pipe(
      reorientArea(selectedShipIndex, ships),
      O.chain((ship) =>
        selectedShipIndex ? O.some(getUpdatedArea(selectedShipIndex)) : O.none
      ),
      O.getOrElse(() => area)
    );

  const ioWind = () => {
    windDirection = changeWind();
    area = resetArea();
  };

  const getAttackableClass = (i: number) =>
    isAttackable(ships, turn, area)(i) ? "attackable" : "";

  const ioRoll = () => {
    roll = rollDie();
    area = resetArea();
  };

  const getTeamColor = (index: number): string => {
    const shipOrFort = isFortIndex(index) ? forts[index] : ships[index];
    if (shipOrFort == null) {
      return "";
    }
    const color = teams[shipOrFort.team]?.color || "gray-800";
    return `bg-${color}`;
  };
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
            class={`${getTeamColor(i) || (area[i] ? `bg-red-${area[i]}00` : !isLand ? 'bg-blue-500' : getTeamColor(i) || 'bg-green-500')} h-4 w-4 border border-blue-600 ${getAttackableClass(i)}`} />

          <!-- <TileComponent {isLand} isShip={false} onClick={onClick(i)} /> -->
        {/each}
      </div>
    </div>
    <button on:click={endTurn}>End Turn</button>
  </div>
</main>

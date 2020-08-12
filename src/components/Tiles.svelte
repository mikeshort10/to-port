<script lang="ts">
  export let isLand: boolean, isShip: boolean, onClick: () => void;
  const bgColor = isShip
    ? "bg-red-500"
    : isLand
    ? "bg-green-500"
    : "bg-blue-500";
</script>

<div on:click={onClick} class={`${bgColor} h-4 w-4`} />

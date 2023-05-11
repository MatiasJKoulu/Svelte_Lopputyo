<script>
  //event dispatcheri että voidaan lähettää tietoa eteenpäin
  //ja lähetetään se napin sisältö takaisin
  //voittiko functioniin
  import Napit from './Napit.svelte';
  export let arvaus;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function voittiko() {
    dispatch('voittiko', arvaus);
  }
</script>

<Napit on:click={voittiko}>{arvaus}</Napit>

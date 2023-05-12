<script>
  //importaukset ja propit
  import Napit from './Napit.svelte';
  import Modal from './Modal.svelte';
  export let nimi = '';
  import { createEventDispatcher } from 'svelte';
  //muuttujat
  const dispatch = createEventDispatcher();
  const sulje = () => dispatch('sulje');
  const lisaa = () => dispatch('lisaa', { nimi: nimi });
  //funktiot
  //tarkastaa onko sähköposti oikea tarkastamalla sisältääkö tekstiä, @ merkin, .com tai .fi ja ei sisällä välejä
  //ja palauttaa true tai false
  function onkoSisalto(nimi) {
    if (
      (nimi.length > 0 &&
        nimi.includes('@') &&
        nimi.includes('.com') &&
        !nimi.includes(' ')) ||
      (nimi.length > 0 &&
        nimi.includes('@') &&
        nimi.includes('.fi') &&
        !nimi.includes(' '))
    ) {
      return true;
    } else {
      return false;
    }
  }
</script>

<Modal>
  <div slot="header">
    <h2>Subscribe for flag facts!</h2>
  </div>

  Email:
  <input type="text" bind:value={nimi} />

  <div slot="footer">
    {#if (nimi.length > 0 && nimi.includes('@') && nimi.includes('.com') && !nimi.includes(' ')) || (nimi.length > 0 && nimi.includes('@') && nimi.includes('.fi') && !nimi.includes(' '))}
      <Napit kaytossa on:click={lisaa}>Subscribe</Napit>
    {:else}
      <p>Check that the Email is valid!</p>
      <button disabled={!onkoSisalto(nimi)}>Subscribe</button>
    {/if}

    <Napit on:click={sulje}>Close</Napit>
  </div>
</Modal>

<style>
  p {
    color: red;
  }
</style>

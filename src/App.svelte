<script>
  //importattavat asiat ja propit
  export let name;
  import Napit from './Napit.svelte';
  import Arvaukset from './Arvaukset.svelte';

  import { fade, fly } from 'svelte/transition';
  import Tilaa from './Tilaa.svelte';

  //muuttujat
  let arvottuLuku = '';
  let oikeaMaa = '';
  let valitseRandomi = ['y', 'n', 'n', 'n'];
  let tilaajat = [];
  let nimi = '';
  let nayta = false;
  let valittu = '';
  let rollatutMaat = [];
  let pisteet = 0;
  let onkoPeliKaynnissa = true;
  let onkoTilannut = false;
  let onkoGameOver = false;
  $: lippu = '';

  //funktiot

  //Haetaan restcountriesta euroopan maat joista arvotaan yksi oikea maa ja sen lippu
  //Nämä haetaan uudestaan aina kun painetaan oikeaa nappia tai try again nappia
  const haeMaaTiedot = async () => {
    const response = await fetch(
      'https://restcountries.com/v3.1/region/europe'
    );
    let data = await response.json();
    let arvottuLuku = Math.floor(Math.random() * (data.length - 1) + 1);

    valitseRandomi = ['y', 'n', 'n', 'n'];
    rollatutMaat = [];
    oikeaMaa = data[arvottuLuku].name.common;
    lippu = data[arvottuLuku].flag;
    for (let i = 0; i < 4; i++) {
      let a = Math.floor(Math.random() * valitseRandomi.length);
      let arvottuNappi = valitseRandomi.splice(a, 1);
      //ottaa valitseRandomi:sta joko y (kyllä oikea vastaus) n (ei oikea vastaus)
      //ja poistaa valitun ettei sitä voida antaa uudestaan
      //kun koodi kutsutaan se resettaa
      let arvottuLuku = Math.floor(Math.random() * (data.length - 1) + 1);

      data.slice(arvottuLuku, arvottuLuku + 1);

      if (arvottuNappi == 'y') {
        rollatutMaat.push(oikeaMaa);
        //oikeaMaa arvotaan jo aikaisemmin koodissa ja pushattaan Rollatutmaat silloin kun arvottuNappi antaa Y:n
        //että saisimme satunnaisen järjestyksen
        //RollatutMaat muuttujasta otetaan nappien sisältö ja niiden järjestys
      }
      if (arvottuNappi == 'n') {
        valittu = data[arvottuLuku].name.common;

        //Ja jos arvottuNappi on n
        //Arvotaan restcountriesta vääriä nappeja
        //tarkastetaan ettei tule 2 samaa nappia luotua
        //jos näin tapahtuu se antaa uuden maan kunnes se on eri kuin muut napit
        //kun on tarkastettu ettei ole toistuvia maita maa laitetaan rollatutMaat array:hyn
        if (rollatutMaat.includes(valittu) || valittu === oikeaMaa) {
          let vanhaValittu = valittu;

          while (valittu === vanhaValittu || valittu === oikeaMaa) {
            valittu =
              data[Math.floor(Math.random() * (data.length - 1))].name.common;
          }
          rollatutMaat.push(valittu);
        } else {
          rollatutMaat.push(data[arvottuLuku].name.common);
        }
      }
    }
    return data[arvottuLuku];
  };

  //tarkistaa painoitko oikeaa vai väärää nappia
  //jos painoit oikeaa se antaa uudet maat ja lipun
  //jos painoit väärää se peli loppuu ja tule gameOver tila
  //gameOver tila ja onkoPeliKaynnissa ovat eri että sain animaation
  //toimimaan oikean muuten ne olisi voinut olla sama
  function voittiko(ce) {
    if (ce.detail == oikeaMaa) {
      pisteet++;
      haeMaaTiedot();
    }
    if (ce.detail !== oikeaMaa) {
      onkoPeliKaynnissa = false;
      onkoGameOver = true;
    }
  }
  //näytetäänkö Modaali
  function naytaJutut() {
    if (!nayta) nayta = true;
    else nayta = false;
  }
  //Lisätään tilaaja ja näytetään kiitos viesti
  function lisaa(ce) {
    tilaajat.push({
      nimi: ce.detail.nimi,
    });
    tilaajat = tilaajat;
    //jätin tämän tänne että näkee uuden tilaajan
    console.log(tilaajat[0].nimi);
    console.log(tilaajat);
    onkoTilannut = true;
    nayta = false;

    setTimeout(() => {
      onkoTilannut = false;
    }, 10000);
  }
  //kun peli on loppunut näkyy uusi peli nappi
  //joka käynnistää uuden pelin
  //koodi resettää pisteet ja kutsuu uudet maat ja lipun ja kun
  //animaatio on loppunut näyttää ne pelaajalle
  function uusiKierros() {
    pisteet = 0;
    onkoGameOver = false;
    setTimeout(() => {
      onkoPeliKaynnissa = true;
      haeMaaTiedot();
    }, 1200);
  }
</script>

<svelte:head>
  <title>{name}</title></svelte:head
>
<!--Itse peli-->
<main>
  <div>
    <h1>Flag guessing game</h1>
    {#if onkoPeliKaynnissa}
      <div>
        {#await haeMaaTiedot()}
          <p>...waiting</p>
        {:then MaaTiedot}
          <p>Which countrys flag is this?</p>
          <p style="font-size: 400%;">{lippu}</p>

          {#each rollatutMaat as maa}
            <Arvaukset arvaus={maa} on:voittiko={voittiko} />
          {/each}

          <p>Points: {pisteet}</p>
        {:catch error}
          <p>An error occurred!</p>
        {/await}
      </div>

      <p />
    {/if}
    <!--Game over-->
    {#if onkoGameOver}
      <h2
        in:fly|local={{
          duration: 1000,
          delay: 200,
          x: 500,
        }}
        out:fly|local={{
          duration: 1000,
          delay: 200,
          x: 500,
        }}
      >
        You lose <br /> The right awnser was {oikeaMaa}
        {lippu}
      </h2>

      <p>You got {pisteet} points!</p>
      <Napit on:click={uusiKierros}>Try Again?</Napit>
      <p />
    {/if}
    <!--Modaalin nappulat-->
    {#if nayta}
      <Napit on:click={naytaJutut}>Hide subscription</Napit>
    {:else}
      <Napit on:click={naytaJutut}>Subscribe for flag facts</Napit>
    {/if}
    {#if nayta}
      <Tilaa on:sulje={() => (nayta = false)} on:lisaa={lisaa} />
    {/if}
  </div>
</main>
<!--Jos tilataan lippu faktoja pelaajaa kiitetään ja viesti häviää 10 sekunnin jälkeen-->
<footer>
  {#if onkoTilannut}
    <h3
      in:fade|local={{
        duration: 1000,
      }}
      out:fade|local={{
        duration: 1000,
      }}
    >
      Thanks for subscribing!
    </h3>
  {/if}
</footer>

<style>
  h2 {
    padding-top: 100px;
    color: red;
  }
  h3 {
    color: green;
  }
  main,
  footer {
    text-align: center;
    display: flex;
    justify-content: center;
  }
</style>

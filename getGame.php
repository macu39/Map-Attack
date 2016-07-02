<?php

   $game=$_GET["g"];
   $dato=$_GET["d"];
   
   if(isset($game)){
      
      //Abro el juego que me piden
      $fp = fopen("games/".$game, "r");
      
      //Cojo todas las variables del juego
      $pista = fgets($fp);
      $solucion = fgets($fp);
      fclose($fp);
      
      //Imprimo lo que me piden      
      if($dato=="pista"){
         echo$pista;
         
      }else if($dato=="solucion"){
         echo$solucion;
         
      }else{
         echo"Error.";
      }
   }
   
?>
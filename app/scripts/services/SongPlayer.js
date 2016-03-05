(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

/**
  *@function currentAlbum
  *@desc gets/stores album info retrieved from Fixtures' getAlbum function
*/
    var currentAlbum = Fixtures.getAlbum();


 /**
 * @function updatePlayerBarSong
 * @loads currently playing song information
 * @param {Object} song
 */
    var updatePlayerBarSong = function() {
      $('.currently-playing .song-name').text(currentSongFromAlbum.name);
      $('.currently-playing .artist-name').text(currentAlbum.artist);
      $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
            
      $('.main-controls .play-pause').html(playerBarPauseButton);
            
      setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));
    };    


 /**
 * @function playSong
 * @desc Loads new audio file as currentBuzzObject
 * @param {Object} song
 */
    var playSong = function(song) {
    currentBuzzObject.play();
    song.playing = true;
    };


 /**
 * @desc Buzz object audio file
 * @type {Object}
 */
    var currentBuzzObject = null;

/**
* @function stopSong    
* @desc Stops currentBuzzObject audio file from playing
* @param {Object} song
*/
    var stopSong = function(song) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
    };


 /**
 * @function setSong
 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
 * @param {Object} song
 */
   var setSong = function(song) {
      if (currentBuzzObject) {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
      }
   
      currentBuzzObject = new buzz.sound(song.audioUrl, {
          formats: ['mp3'],
          preload: true
      });
   
      currentBuzzObject.bind('timeupdate', function() {
         $rootScope.$apply(function() {
             SongPlayer.currentTime = currentBuzzObject.getTime();
         });
      });

      SongPlayer.currentSong = song;

   };


 /**
 * @function getSongIndex
 * @desc gets index of a song
 * @param {Object} song
 */
   var getSongIndex = function(song) {
    return currentAlbum.songs.indexOf(song);
   };

 /**
 * @desc Current song from album
 * @type {Object}
 */
  SongPlayer.currentSong = null;

 /**
 * @desc Current playback time (in seconds) of currently playing song
 * @type {Number}
 */
 SongPlayer.currentTime = null;


 /**
 * @function play
 * @desc Play current or new song
 * @param {Object} song
 */

    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        
        setSong(song);
        playSong(song);


      } 
      if ( SongPlayer.currentSong == null ) {
        setSong(song);
        playSong(song);
      }
      else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
            playSong(song);
          }
      }    

    };

 /**
 * @function pause
 * @desc Pause current song
 * @param {Object} song
 */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

  /**
  * @function previous
  * @desc go to previous song
  * @param {Object} song
  */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > 5) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);

      }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
        if (currentBuzzObject) {
            currentBuzzObject.setTime(time);
        }
    };


  /**
  * @function next
  * @desc go to next song
  * @param {Object} song
  */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);

      }
    };    


    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', [ '$rootScope', 'Fixtures', SongPlayer ]);

})();
const player = {
  songs: [
    {
      id: 1,
      title: 'Vortex',
      album: 'Wallflowers',
      artist: 'Jinjer',
      duration: 242,
    },
    {
      id: 2,
      title: 'Vinda',
      album: 'Godtfolk',
      artist: 'Songleikr',
      duration: 160,
    },
    {
      id: 7,
      title: 'Shiroyama',
      album: 'The Last Stand',
      artist: 'Sabaton',
      duration: 213,
    },
    {
      id: 3,
      title: 'Thunderstruck',
      album: 'The Razors Edge',
      artist: 'AC/DC',
      duration: 292,
    },
    {
      id: 4,
      title: 'All is One',
      album: 'All is One',
      artist: 'Orphaned Land',
      duration: 270,
    },
    {
      id: 5,
      title: 'As a Stone',
      album: 'Show Us What You Got',
      artist: 'Full Trunk',
      duration: 259,
    },
  ],
  playlists: [
    { id: 1, name: 'Metal', songs: [1, 7, 4] },
    { id: 5, name: 'Israeli', songs: [4, 5] },
  ],
  playSong({ title, album, artist, duration }) {
    // receives a song object.
    console.log(
      `Playing ${title} from ${album} by ${artist} | ${convertSecToMinFormat(
        duration
      )}.`
    )
  },
}

// help functions! ---------

function convertSecToMinFormat(sec) {
  // sec => mm:ss format.
  const holeMin = Math.floor(sec / 60)
  const secondsLeft = sec % 60
  return formatNumber(holeMin) + ':' + formatNumber(secondsLeft)
}

function convertMinFormatToSec(minFormat) {
  const arr = minFormat.split(':').map((str) => Number(str))
  return 60 * arr[0] + arr[1]
}

function formatNumber(num) {
  // to format from "6" => "06".
  // note: only works until 99;
  return ('0' + num).slice(-2)
}

// ------------------

function getSong(id) {
  return getObjectFromArray(id, player.songs)
}

function getPlaylist(id) {
  return getObjectFromArray(id, player.playlists)
}

function getObjectFromArray(objId, objectArr) {
  // throw Error if Object does not exists.
  const requestedObject = objectArr.find((obj) => obj.id === objId)
  if (requestedObject === undefined) throw new Error('so such object exists')
  return requestedObject
}

// ------------------

function removeSongFromSongs(id) {
  removeObjectFromArray(id, player.songs)
}

function removeObjectFromArray(objId, objectArr) {
  objectArr.splice(objectArr.indexOf(getObjectFromArray(objId, objectArr)), 1)
}

// ------------------

function removeSongFromPlaylists(id) {
  let indexOfSong
  for (let playlist of player.playlists) {
    if ((indexOfSong = playlist.songs.indexOf(id)) !== -1) {
      playlist.songs.splice(indexOfSong, 1)
    }
  }
}

function generateNewIdInArrayOfObjects(objectArr) {
  /* Gets the largest id and returns it + 1. 
  i.e the returning id does not exists in the
  array and is unique.
  */
  return Math.max(...getIdsArrayFromObjArray(objectArr)) + 1
}

function getIdsArrayFromObjArray(objectArr) {
  return objectArr.map((obj) => obj.id)
}

function checkIfSongIdTaken(id) {
  try {
    getSong(id) // remember: getSong throws Error if no song was found.
    throw new Error('id already exist')
  } catch (error) {
    /* 
    Only if the error is because of "finding" the song
    then we continue and throw an Error.
    */
    if (error.message === 'id already exist') {
      throw new Error('id already exist')
    }
  }
}

// end of help functions. ---------

function playSong(id) {
  player.playSong(getSong(id));
}

function removeSong(id) {
  removeSongFromSongs(id)
  removeSongFromPlaylists(id)
}

function addSong(
  title,
  album,
  artist,
  duration,
  id = generateNewIdInArrayOfObjects(player.songs)
) {
  checkIfSongIdTaken(id)

  player.songs.push({
    title,
    album,
    artist,
    duration: convertMinFormatToSec(duration),
    id,
  })
  return id
}

function removePlaylist(id) {
  removeObjectFromArray(id, player.playlists)
}

function createPlaylist(name, id) {
  // your code here
}

function playPlaylist(id) {
  // your code here
}

function editPlaylist(playlistId, songId) {
  // your code here
}

function playlistDuration(id) {
  // your code here
}

function searchByQuery(query) {
  // your code here
}

function searchByDuration(duration) {
  // your code here
}

module.exports = {
  player,
  playSong,
  removeSong,
  addSong,
  removePlaylist,
  createPlaylist,
  playPlaylist,
  editPlaylist,
  playlistDuration,
  searchByQuery,
  searchByDuration,
}

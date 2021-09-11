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
    console.log(`Playing ${title} from ${album} by ${artist} | ${convertSecToMinFormat(duration)}.`)
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
  // note: only works up to 99.
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
  // throws Error if Object does not exists.
  const requestedObject = objectArr.find((obj) => obj.id === objId)
  if (requestedObject === undefined) throw new Error('so such object exists')
  return requestedObject
}

function removeSongFromSongs(id) {
  removeObjectFromArray(id, player.songs)
}

function removeObjectFromArray(objId, objectArr) {
  objectArr.splice(objectArr.indexOf(getObjectFromArray(objId, objectArr)), 1)
}

function removeSongFromPlaylists(id) {
  let indexOfSong
  for (let playlist of player.playlists) {
    // Remember: .indexOf(element) returns -1 if the element is not present in the array.
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
  const idArray = getIdsArrayFromObjArray(objectArr)
  if (idArray.length === 0) return 1
  return Math.max(...idArray) + 1
}

function getIdsArrayFromObjArray(objectArr) {
  return objectArr.map((obj) => obj.id)
}

function checkIfObjectIdTaken(id, getFunction) {
  // getFunction is a function expression. we will know where to search depending on the function
  try {
    getFunction(id) // remember: getFunction can be: [getSong or getPlaylist] and throws Error if no song was found.
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

const durationReducer = (totalDuration, songId) => totalDuration + getSong(songId).duration

function searchByQueryInSongs(query) {
  return searchByQueryInArr(query, player.songs).sort(compareFunction('title'))
}

function searchByQueryInPlaylist(query) {
  return searchByQueryInArr(query, player.playlists).sort(compareFunction('name'))
}

function searchByQueryInArr(query, arr) {
  let matchArr = []
  for (let obj of arr) {
    for (let property of Object.values(obj)) {
      if (('' + property).toLowerCase().includes(query)) {
        matchArr.push(obj)
        break
      }
    }
  }
  return matchArr
}

function compareFunction(byProperty) {
  // returns a compareFunction based on what property to sort by, e.g "title" or "name".
  // remember: we are sorting objects.
  return (a, b) => {
    if (a[byProperty] < b[byProperty]) {
      return -1
    }
    if (a[byProperty] > b[byProperty]) {
      return 1
    }
    return 0
  }
}

function getClosestSong(duration) {
  /* In this function we compare the distance between the given
  duration and the songs duration. every time, we keep the closest song */
  let closestSong = player.songs[0]
  for (let song of player.songs) {
    if (Math.abs(closestSong.duration - duration) >= Math.abs(song.duration - duration)) {
      closestSong = song
    }
  }
  return closestSong
}

function getClosestPlaylist(duration) {
  /* Same as in getClosestSong but this time, to get the playlist
  duration, we use the function playlistDuration */
  let closestPlaylist = player.playlists[0]
  for (let playlist of player.playlists) {
    if (
      Math.abs(playlistDuration(closestPlaylist.id) - duration) >=
      Math.abs(playlistDuration(playlist.id) - duration)
    ) {
      closestPlaylist = playlist
    }
  }
  return closestPlaylist
}

// end of help functions. ---------

function playSong(id) {
  player.playSong(getSong(id))
}

function removeSong(id) {
  removeSongFromSongs(id)
  removeSongFromPlaylists(id)
}

function addSong(title, album, artist, duration, id = generateNewIdInArrayOfObjects(player.songs)) {
  checkIfObjectIdTaken(id, getSong)
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

function createPlaylist(name, id = generateNewIdInArrayOfObjects(player.playlists)) {
  checkIfObjectIdTaken(id, getPlaylist)

  player.playlists.push({ id, name, songs: [] })
  return id
}

function playPlaylist(id) {
  getPlaylist(id).songs.forEach((songId) => playSong(songId))
}

function editPlaylist(playlistId, songId) {
  // <getPlaylist and getSong> checks if such objects exist.
  const SongsArr = getPlaylist(playlistId).songs
  getSong(songId)

  if (SongsArr.includes(songId)) {
    if (SongsArr.length === 1) {
      removePlaylist(playlistId)
    } else {
      SongsArr.splice(SongsArr.indexOf(songId), 1)
    }
  } else {
    SongsArr.push(songId)
  }
}

function playlistDuration(id) {
  // durationReducer - a function to reduce with, look in help functions.
  return getPlaylist(id).songs.reduce(durationReducer, 0)
}

function searchByQuery(query) {
  query = query.toLowerCase()
  return { songs: searchByQueryInSongs(query), playlists: searchByQueryInPlaylist(query) }
}

function searchByDuration(duration) {
  duration = convertMinFormatToSec(duration)

  const closestSong = getClosestSong(duration)
  const closestPlaylist = getClosestPlaylist(duration)

  if (
    Math.abs(closestSong.duration - duration) >=
    Math.abs(playlistDuration(closestPlaylist.id) - duration)
  ) {
    return closestPlaylist
  }
  return closestSong
}

// End of normal Requirements --------

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

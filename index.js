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
  return Math.max(...getIdsArrayFromObjArray(objectArr)) + 1
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

function addSong({
  title,
  album,
  artist,
  duration,
  id = generateNewIdInArrayOfObjects(player.songs),
}) {
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

function addSongToNode(song) {
  const { id, title, album, artist, duration } = song
  let div = document.createElement('DIV')
  let h2 = document.createElement('H2')
  let ul = document.createElement('UL')
  let li1 = document.createElement('LI')
  let li2 = document.createElement('LI')
  let li3 = document.createElement('LI')
  let li4 = document.createElement('LI')
  let playButton = document.createElement('button')
  let infoButton = document.createElement('button')

  div.id = '' + song.id

  playButton.onclick = () => {
    playSong(id)
    alert(`Playing ${title} from ${album} by ${artist} | ${convertSecToMinFormat(duration)}.`)
  }
  playButton.innerHTML = 'Play me'
  playButton.className = 'play-song-button'

  infoButton.onclick = () => getInfoFromApi(song).then(data => alert(data))
  infoButton.innerHTML = 'Info'
  infoButton.className = 'play-song-button'

  li1.append(document.createTextNode('Id: ' + id))
  li2.append(document.createTextNode('Album: ' + album))
  li3.append(document.createTextNode('Artist: ' + artist))
  li4.append(document.createTextNode('Duration: ' + convertSecToMinFormat(duration)))

  h2.append(document.createTextNode(`Title: ${title}`))
  ul.append(li1, li2, li3, li4)

  div.append(h2, ul, playButton, infoButton)
  div.className = 'song-div'
  document.getElementById('song_section').append(div)
}

function clearSection(sectionId) {
  const sectionToClear = document.getElementById(sectionId)
  sectionToClear.innerHTML = ''
}

function displayAllSongs() {
  for (let song of player.songs) {
    addSongToNode(song)
  }
}

function addSongAndDisplay() {
  clearSection('song_section')
  try {
    addSong(getSongFromInputElem())
  } catch (error) {
    alert(error.message)
  }
  displayAllSongs()
}

function getSongFromInputElem() {
  const id = parseInt(document.getElementById('id').value)
  const title = document.getElementById('title').value
  const album = document.getElementById('album').value
  const artist = document.getElementById('artist').value
  const duration = document.getElementById('duration').value

  if (!title || !album || !artist || !duration) {
    throw new Error('more information')
  }
  if (!id) {
    return { title, album, artist, duration }
  } else {
    return { id, title, album, artist, duration }
  }
}

function removeSongFromDisplay(songId) {
  let songDiv = document.getElementById('' + songId)
  songDiv.remove()
  removeSong(songId)
}

async function getInfoFromApi(song) {
  /* this function is used to get information from
  lost.fm api. for more information on how to work with
  the api go to: "https://www.last.fm/api/show/artist.getInfo" */

  /* 
  Application name	gavriMp3Player
  API key	4d3aa563118a0aed9edfae55f7c189d2
  Shared secret	bd5f041c79bd40112a4d9f8a8544578c
  Registered to	zazox44
  */

  const resp = await fetch(
    'https://ws.audioscrobbler.com/2.0/?' +
    new URLSearchParams({
      method: 'artist.getinfo',
      artist: song.artist,
      api_key: '4d3aa563118a0aed9edfae55f7c189d2',
      format: 'json',
    })
  )
  const data = await resp.json()
  return data.artist.bio.summary.slice(0, data.artist.bio.summary.indexOf('<a'))
}

displayAllSongs()

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

function addSongToNode(song) {
  // adds a song div to the main_section element
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
  let deleteButton = document.createElement('button')

  div.id = '' + song.id

  // buttons:
  playButton.onclick = () => {
    playSong(id)
    alert(`Playing ${title} from ${album} by ${artist} | ${convertSecToMinFormat(duration)}.`)
  }
  playButton.innerHTML = 'Play me'
  playButton.className = 'play-song-button'

  infoButton.onclick = () => getInfoFromApi(song).then((data) => alert(data))
  infoButton.innerHTML = 'Info'
  infoButton.className = 'play-song-button'

  deleteButton.onclick = () => removeSongFromDisplay(id)
  deleteButton.innerHTML = 'delete'
  deleteButton.className = 'delete-button'

  // details:
  li1.append(document.createTextNode('Id: ' + id))
  li2.append(document.createTextNode('Album: ' + album))
  li3.append(document.createTextNode('Artist: ' + artist))
  li4.append(document.createTextNode('Duration: ' + convertSecToMinFormat(duration)))

  h2.append(document.createTextNode(`Title: ${title}`))
  ul.append(li1, li2, li3, li4)

  // the final append in to the song div
  div.append(h2, ul, playButton, infoButton, deleteButton)
  div.className = 'song-div'
  // inserting the div into the section element
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
    addSong(...getSongArgsFromInputElem())
  } catch (error) {
    alert(error.message)
  }
  displayAllSongs()
}

function getSongArgsFromInputElem() {
  const id = parseInt(document.getElementById('id').value)
  const title = document.getElementById('title').value
  const album = document.getElementById('album').value
  const artist = document.getElementById('artist').value
  const duration = document.getElementById('duration').value

  // here we need to handle different or bad inputs
  if (!title || !album || !artist || !duration) {
    throw new Error('more information')
  }
  if (!id) {
    return [title, album, artist, duration]
  } else {
    return [title, album, artist, duration, id]
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

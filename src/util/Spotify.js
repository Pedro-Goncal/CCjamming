import SearchBar from "../Components/SearchBar/SearchBar";

const clientId = 'f034d6ca4b2a4cf1a4fe44de30dce0fa';
const redirectUri = 'http://localhost:3000/';
let accessToken;



const Spotify = {
   getAccessToken() {
      if (accessToken){
         return accessToken
      }

      //Check for an access token match
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if(accessTokenMatch && expiresInMatch) {
         accessToken = accessTokenMatch[1];
         const expiresIn = Number(expiresInMatch[1]);
         //This clears the parameters, allowing us to grab a new access token when it expires.
         window.setTimeout(() => accessToken = '', expiresIn * 1000);
         window.history.pushState('Access Token', null, '/');
         return accessToken;
      }else{
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl; 
      }
   },

   async search(term) {
      try {
         const accessToken = Spotify.getAccessToken();
         const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: { Autorization: `Bearer ${accessToken}` } });
         const jsonResponse = await response.json();
         if (!jsonResponse.tracks) {
            return [];
         }
         return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artist[0].name,
            album: track.album.name,
            uri: track.uri
         }));
      } catch (error) {
         console.log(error);
      }
   },

   async savePlaylist(name, trackUris){
      if(!name || !trackUris.length){
         return;
      }

      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };  
      let userId; 

      const response = await fetch('https://api.spotify.com/v1/me', { headers: headers }
      );
      const jsonResponse = await response.json();
      userId = jsonResponse.id;
      const response_1 = await fetch(`https://api.spotify.com/v1/user/${userId}/playlists`,
         {
            headers: headers,
            methode: 'POST',
            body: JSON.stringify({ name: name })
         });
      const jsonResponse_1 = await response_1.json();
      const playlistId = jsonResponse_1.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
         {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
         });
   }
}

export default Spotify;
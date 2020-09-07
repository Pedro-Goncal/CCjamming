import React from 'react';

import "./PlayList.css";

import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {   
   constructor(props){
      super(props);

      this.handleNameChange = this.handleNameChange.bind(this);
   }
   
   handleNameChange(event){
      this.props.onNameChange(event.target.value);
   }

   render() {
      return(
         <div className="Playlist">
            <input placeholder="New Playlist" onChange={this.handleNameChange}  />
            <TrackList tracks={this.props.playlistTracks}
                        onRemove={this.props.onRemove}
                        isRemovable={true} />
            <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
         </div>
      )
   }
}

export default PlayList;
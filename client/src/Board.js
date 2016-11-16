import React, { Component } from 'react';
import { Link } from 'react-router'
import request from 'superagent';
import Note from './Note';

var SearchBar = React.createClass({
  handleChange() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
    );
  },

render() {
  return (
    <form>
      <input
        type="text"
        placeholder="Title Search..."
        value={this.props.filterText}
        ref="filterTextInput"
        onChange={this.handleChange}
      />
    </form>
    );
  }
})

var Board = React.createClass({
    getInitialState() {
        return {
            notes: [''], filterText: ''
        }
    },
    componentDidMount() {
      var self = this;
      request
       .get('/api/explore')
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if (err || !res.ok) {
           console.log('Oh no! error', err);
         } else {
           self.setState({notes: res.body.allposts});
         }
       });
    },
    remove(id) {
        var notes = this.state.notes.filter(note => note.postId !== id)
        this.setState({notes})
    },
    like (id, likelist){
      if(likelist.includes(this.props.routeParams.userId)){
        alert('You have already liked this')
        console.log('Will return false')
        return false;
      }
      else{
        request
          .post('/api/like/')
          .send({ postId: id, user: this.props.routeParams.userId })
          .set('Accept', 'application/json')
          .end(function(err, res){
            if (err || !res.ok) {
              alert('Oh no! error');
            } else {
              alert('Liked Post');
            }
          });
          console.log('Will return true')
          return true;
      }
    },
    eachNote(note) {
        return (<Note key={note.postId}
                      id={note.postId}
                      post={note}
                      onRemove={this.remove}
                      onLike={this.like}>
                  {note.postPic}
                </Note>)
    },
    handleUserInput(filterText) {
      this.setState({
        filterText: filterText,
      });
    },
    render() {
      var filteredNotes = []
      this.state.notes.forEach((note) => {
        var notevar = "" + note.postTitle
        if (notevar.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1) {
          return;
        }
        else {
          filteredNotes.push(note);
        }
      });
        return (
          <div>
          <Link to={`/user/${this.props.routeParams.userId}`}><h2>My feed</h2></Link>
          <Link to={`/myposts/${this.props.routeParams.userId}`}><h2>My Posts</h2></Link>
          <Link to={`/add/${this.props.routeParams.userId}`}><h2>Add new content</h2></Link>
          <br/>
          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
          />
            <div className="wrapper">
            <div className="columns">
            <div className='board'>
                   {filteredNotes.map(this.eachNote)}
                </div>
                </div>
                </div>
            </div>
                )
    }
})

export default Board;

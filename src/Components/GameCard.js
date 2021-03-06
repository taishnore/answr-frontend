import React from "react";
// import {Card, Button} from "semantic-ui-react";
import { connect } from "react-redux";
import { playerJoinsGame } from "../redux/thunks.js";
import { withRouter } from "react-router-dom";
import { openGame, clearAvailableGames } from "../redux/actions.js";

class GameCard extends React.Component {
  clickHandler = () => {
    //todo does this method cause the backend to broadcast an updated array? Where is that information received? probably in gameList?
    this.props.playerJoinsGame(
      this.props.id,
      this.props.currentUser.id,
      this.props.history
    );
    //i think this action is what takes a player into the game. openGame and startGame are different. it navigates the user to /play-game, todo via app.js Switch??
    this.props.openGame();
    this.props.clearAvailableGames();
  };

  render() {
    return (
      <div className="card">
        <div className="card-container">
          <h3 className="card-title">{this.props.title}</h3>
          <p className="card-host">Host: {this.props.host}</p>
          <p className="card-spots">Spots Left: {this.props.spots}</p>
          {/* todo I want to show how many players are in the game, and how many more are needed. how could I do this? pretty easily, i bet. */}
          <button className="card-join button" onClick={this.clickHandler}>
            Join
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    playerJoinsGame: (gameId, userId, historyObj) =>
      dispatch(playerJoinsGame(gameId, userId, historyObj)),
    openGame: () => dispatch(openGame()),
    clearAvailableGames: () => dispatch(clearAvailableGames())
  };
};

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GameCard)
);

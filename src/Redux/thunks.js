/*----------------THUNK CREATORS---------------*/
import {
  regUser,
  logUser,
  jwtLog,
  newCurrentGame,
  addGames,
  putRounds,
  removeCurrentGame,
  playerTwoAddsCurrentGame,
  addFriend,
  addUsers
} from "./actions";

export const registerUser = userObj => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        user: {
          name: userObj.name,
          email: userObj.email,
          password: userObj.password
        }
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          let error = new Error("Registration unsuccessful. Please try again.");
          throw error;
        }
      })
      .then(res => {
        localStorage.setItem("token", `${res.jwt}`);
        dispatch(regUser(res));
      })
      .catch(err => {
        alert(err.message);
      });
  };
};

export const logUserIn = userObj => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        user: {
          email: userObj.email,
          password: userObj.password
        }
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          let error = new Error("Log in unsuccessful, please try again");
          throw error;
        }
      })
      .then(res => {
        localStorage.setItem("token", `${res.jwt}`);
        dispatch(logUser(res));
      })
      .catch(err => {
        alert(err.message);
      });
  };
};

export const logUserInWithToken = token => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/user", {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
        Authorization: `${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        dispatch(jwtLog(res));
      });
  };
};

export const createNewGame = (gameObj, userObj, historyObj) => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify({
        title: gameObj.title,
        user_id: userObj.id
      })
    })
      .then(res => res.json())
      .then(res => {
        dispatch(newCurrentGame(res.game));
        //what happens when I create a new game?
        dispatch(putRounds(res.rounds));
        historyObj.push("/play-game");
      });
  };
};

export const getGames = () => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/games")
      .then(res => res.json())
      .then(res => {
        // let availableGames = res.filter(game => {
        //   return game.is_game_in_play === false;
        // });
        dispatch(addGames(res));
      });
  };
};

export const deleteGame = gameObj => {
  return dispatch => {
    return fetch(`http://localhost:3000/api/v1/games/${gameObj.id}`, {
      method: "DELETE"
    }).then(dispatch(removeCurrentGame()));
  };
};

export const playerJoinsGame = (gameId, userId, historyObj) => {
  return dispatch => {
    return fetch(`http://localhost:3000/api/v1/games/${gameId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify({
        game_id: gameId,
        user_id: userId
      })
    })
      .then(res => res.json())
      .then(res => {
        let friends = res.users.filter(user => user.id !== userId);
        console.log("***");
        console.log("in here, here's the res:", res);
        console.log("***");

        dispatch(putRounds(res.rounds));
        dispatch(addUsers(res.users));
        dispatch(addFriend(friends));
        dispatch(playerTwoAddsCurrentGame(res));
        historyObj.push("/play-game");
      });
  };
};

export const submitAnswer = (answerText, gameId, userId) => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify({
        answer: answerText,
        game_id: gameId,
        user_id: userId
      })
    });
  };
};

export const incrementGameRound = gameId => {
  return dispatch => {
    return fetch("http://localhost:3000/api/v1/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify({
        game_id: gameId
      })
    });
  };
};

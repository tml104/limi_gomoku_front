import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as bs from 'react-bootstrap';
//import App from './App';

function Square(props) {



    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {(() => {
                if (props.value === 0) {
                    return null;
                }
                else if (props.value % 2 === 1) {
                    return "⚫";
                }
                return "⚪";
            })()}
        </button>
    );
}


class Board extends React.Component {


    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />
    }

    renderNumber(i) {
        return <button className="board-num">{i}</button>
    }

    render() {
        const N = 15;
        const gameboard = [];

        gameboard.push(
            <div className='board-row'>
                {
                    (() => {
                        const gameboard_row = [this.renderNumber(null)];

                        for (var j = 0; j < N; j++) {
                            gameboard_row.push(this.renderNumber(j));
                        }

                        return gameboard_row;

                    })()
                }
            </div>
        )

        for (var i = 0; i < N; i++) {
            const gameboard_row = [];

            gameboard_row.push(this.renderNumber(i));

            for (var j = 0; j < N; j++) {
                gameboard_row.push(this.renderSquare(i * N + j));
            }

            gameboard.push(
                <div className='board-row'>
                    {gameboard_row}
                </div>
            )
        }

        return (
            <div className="game-board">
                {gameboard}
            </div>
        );
    }
}

class Panel extends React.Component {

    render() {
        if (this.props.who >= 1 && this.props.who <= 2) {
            return (
                <div className='panel'>
                    <p>Please enter {this.props.who}-th game mode:</p>
                    <Button className='choose-button' onClick={() => this.props.onClick(this.props.who, 0)}>0: Multiplayer</Button>
                    <Button className='choose-button' onClick={() => this.props.onClick(this.props.who, 1)}>1: AI</Button>
                    <Button className='choose-button' onClick={() => this.props.onClick(this.props.who, -1)}>-1: Quit</Button>
                </div>
            );
        }

        return (
            <div className='panel'>
                <p>
                    {(() => {
                        if (this.props.who === 3) {
                            return "Waiting...";
                        }
                        else if (this.props.who === 4) {
                            return "Player1 to move.";
                        }
                        return "Player2 to move.";
                    })()}
                </p>
                {
                    (this.props.who >= 4) ? <Button className='choose-button' onClick={() => this.props.onQuitClick()}>Quit</Button> : null
                }
            </div>
        );
    }

}

class InfoPanel extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         // value: "INFORMATION."
    //         value : this.props.info,
    //     };

    //     this.handleChange = this.handleChange.bind(this)
    // }

    // handleChange(event) {
    //     this.setState(
    //         {
    //             value: event.target.value
    //         }
    //     );
    // }

    render() {
        return (

            <div className='info-panel'>
                <bs.FloatingLabel  label="INFO" className='info-panel' >
                <   bs.Form.Control as='textarea' style={{height:'500px'}} value={this.props.info} readOnly></bs.Form.Control>
                </bs.FloatingLabel>

                {/* <textarea value={this.state.value} onChange={this.handleChange} /> */}
                {/* <textarea value={this.props.info} readOnly /> */}
                {/* <p>{this.props.info}</p> */}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        const N = 15;
        this.state = {
            gamestate: 1, //12; 345;
            squares: Array(N * N).fill(0),
            stepNumber: 0,
            info: 'INFO shows here.\n',
        };
    }



    __clearState() {
        const N = 15;
        this.setState(
            {
                gamestate: 3,
                squares: Array(N * N).fill(0),
                stepNumber: 0,
                info: 'INFO shows here.\n',
            }
        );
    }

    // --- msg handle start

    msgRouter(msg) {
        var msg_ls = msg.split(' ');
        if ((msg_ls[msg_ls.length - 1] === '')) {
            msg_ls.pop();
        }

        var handle_Q1 = (msg_ls) => {
            this.setState(
                {
                    gamestate: 1
                }
            );
        };

        var handle_Q2 = (msg_ls) => {
            this.setState(
                {
                    gamestate: 2
                }
            );
        };

        var handle_START = (msg_ls) => {
            this.__clearState();
        };

        var handle_P = (msg_ls) => {
            var l2 = msg_ls.slice(1).map((x) => parseInt(x));
            var newStepNum = 0;
            l2.forEach((x) => { newStepNum += (x > 0); });

            this.setState(
                {
                    squares: l2,
                    stepNumber: newStepNum
                }
            );
        };

        var handle_QM1 = (msg_ls) => {
            this.setState(
                {
                    gamestate: 4
                }
            );
        };

        var handle_QM2 = (msg_ls) => {
            this.setState(
                {
                    gamestate: 5
                }
            );
        };

        var handle_S = (msg_ls) => {
            this.setState(
                {
                    gamestate: parseInt(msg_ls)
                }
            );
        };

        var handle_I = (msg_ls) => {
            // console.log("IIII!!!!")
            this.setState((state, props) =>
            ({
                info: state.info + msg_ls.slice(1).join(' ') + '\n'
            })
            );
        };

        switch (msg_ls[0]) {
            case "Q1":
                handle_Q1(msg_ls);
                break;
            case "Q2":
                handle_Q2(msg_ls);
                break;
            case "START":
                handle_START(msg_ls);
                break;
            case "P":
                handle_P(msg_ls);
                break;
            case "QM1":
                handle_QM1(msg_ls);
                break;
            case "QM2":
                handle_QM2(msg_ls);
                break;
            case "S":
                handle_S(msg_ls);
                break;
            case "I":
                handle_I(msg_ls);
                break;
            default:
                break;
        }
    }


    componentDidMount() {
        this.msgRouter("123");
        this.ws = new WebSocket("ws://localhost:9999");
        this.ws.onmessage = (msg) => { console.log(msg); this.msgRouter(msg.data); };
        console.log("WS Connected!");
    }

    componentWillUnmount() {
        this.ws.close();
    }


    // --- msg handle end

    handleClick(i) {
        const N = 15;
        if (this.state.gamestate >= 4) {
            var squares2 = this.state.squares.slice();
            var new_piece_who = this.state.stepNumber % 2; //0:b 1:w

            if (squares2[i] !== 0) {
                return;
            }

            squares2[i] = this.state.stepNumber + 1;
            var x = Math.floor(i / N);
            var y = i % N;

            this.ws.send(`AM${new_piece_who + 1} ${x} ${y}`);

            this.setState((state, props) => ({
                gamestate: 3,
                squares: squares2,
                stepNumber: state.stepNumber + 1
            }));

        }
    }

    handleQuit() {
        if (this.state.gamestate >= 4) {
            var new_piece_who = this.state.stepNumber % 2; //0:b 1:w
            this.ws.send(`AM${new_piece_who + 1} ${-1} ${-1}`);
        }
    }

    panelOnClick(who, ans) {
        this.ws.send(`A${who} ${ans}`);
    }


    render() {

        return (
            <div className='game'>

                <Container>
                    <Row className="justify-content-md-center">
                        <Col md='auto'>
                            <Board
                                squares={this.state.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                        </Col>

                        <Col>
                            <Panel
                                who={this.state.gamestate}
                                onClick={(who, ans) => this.panelOnClick(who, ans)}
                                onQuitClick={() => this.handleQuit()}
                            />
                        </Col>

                        <Col>
                            <InfoPanel info={this.state.info}></InfoPanel>
                        </Col>

                    </Row>




                </Container>


            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

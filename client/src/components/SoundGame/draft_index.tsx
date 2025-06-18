import React, {Component, useState} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';
import { useSelector } from "react-redux";
import { selectItems } from "../../redux/reducers/dndReducer";
import getRandomColor from "../../utils/randomColor";
import CreateNewWord from "../../utils/createNewWord";
import { addNewWord } from "../../redux/reducers/dndReducer";
import { useDispatch } from "react-redux";
import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";
import styled from "styled-components";
import Block from "../../components/Block/Block";

export const BlockInLine = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;


const lettersToObj = (letters) => {
    const result = [];
    for (let i = 0; i < letters.length; i++) {
      result.push({
        bg: getRandomColor(),
        title: letters[i],
        id: i + 1,
        hold: false,
        droppedHere: false,
      });
    }
    return result;
  };

function WordGame () {

const [colors, setColors] = useState([]);
const { items } = useSelector(selectItems);
const intWord = 0;
const dispatch = useDispatch();

const handleAddNewWord = (title) => {
    const newWord = new CreateNewWord(
      "uuidv4",
      title,
      false,
      false,
      getRandomColor(),
      colors
    );
    dispatch(addNewWord(newWord));
  };


handleAddNewWord("bonjour")

return (

				  <BlockInLine>
					{items[intWord].letters.map(({ id, title, droppedHere, hold, bg }) => (
					  <Block
						key={id}
						color={bg}
						title={title}
						droppedHere={droppedHere}
						hold={hold}
						id={id}
					  />
					))}
				  </BlockInLine>
);
}

class SoundGame extends Component<TweetGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);

		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:Array.from(Array(this.props.cols).keys()),
			selectedColumn:0
		}

	}

	componentDidMount(){

	}

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>
				<WordGame/>
			  </IonRow>
			</IonGrid>

		);
	};
}


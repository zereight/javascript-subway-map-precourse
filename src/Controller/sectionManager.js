import { confirmAlert, makeElement } from './utils.js';
import words from '../key/words.js';
import { getAllStation } from './stationManager.js';
import { addTableRow } from '../View/template.js';
import { getAllLines, saveAllLines } from './lineManager.js';
import { confirmAlertMessage } from '../key/alertMessages.js';
import Line from '../Model/Line.js';

export const makeNewSectionDeleteButtonElement = (id) =>
	makeElement({
		tag: 'button',
		innerText: words.SECTION_DELETE_FOR_STATION,
		classes: [words.SECTION_DELETE_BUTTON_CLASS],
		id,
    });

export const tableSynchronizer = (tableElement, lineName) => {
	const allLines = getAllLines();
	const targetStations =
		allLines[allLines.map((line) => line.name).indexOf(lineName)].stations;
	targetStations.forEach((stationName, index) => {
		addTableRow(tableElement, [
			`${index}`,
			stationName,
			makeNewSectionDeleteButtonElement(`${lineName}_${stationName}`),
		]);
    });
    applyDeleteEventForAllDeleteButton();
};

export const insertStation = (lineName, stationName, insertElement) => {
	const allLines = getAllLines();
	const allStations = getAllStation();
	const targetLineIndex = allLines.map((line) => line.name).indexOf(lineName);
	const targetStationIndex = allStations
		.map((station) => station.name)
        .indexOf(stationName);
    const insertIndex = insertElement.value;
	allLines[targetLineIndex].stations.splice(
		parseInt(insertIndex),
		0,
		allStations[targetStationIndex].name
	);
	saveAllLines(allLines);
};

export const removeStationOnLine = (lineName, stationName) => {
    const targetLineIndex = Line.searchLinesByName(lineName);

}

export const deleteCallbackFunction = (e) => {
    const {target:buttonElement} = e;
    const {id} = buttonElement;
    const [lineName, stationName] = id.split("_");
    if(confirmAlert(confirmAlertMessage.ALERT_DELETE_CONFIRM)){
        Line.removeStationOnLine(lineName, stationName);
        buttonElement.parentNode.parentElement.remove();
    }
}

export const applyDeleteEventForAllDeleteButton = () => {
    const allDeleteButtons = document.querySelectorAll(`.${words.SECTION_DELETE_BUTTON_CLASS}`);
    allDeleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", deleteCallbackFunction)
    });
}
import './App.css';
import React, {useState} from 'react'
import ReactFileReader from 'react-file-reader'
import {parse} from 'papaparse'
import Header from "./Header";
import Rows from "./Rows";

function App() {
    const [headerWithIdAndDuplicate, setHeaderWithIdAndDuplicate] = useState([])
    const [rowsWithIdAndDuplicate, setRowsWithIdAndDuplicate] = useState([])
    const [isValid, setIsValid] = useState(true)

    const handleFiles = files => {
        console.log(typeof files[0].name.slice(-3))

        if (files[0].name.slice(-3) !== 'csv') {
            setIsValid(false)
        }
        let reader = new FileReader();

        reader.onloadend = function (e) {
            if (reader.result) {
                const header = Object.keys(parse(reader.result, {header: true}).data[0])
                const rows = (parse(reader.result, {header: true}).data)
                const headerWithIdAndDuplicate = (['id', ...header, 'Duplicate with'])
                console.log(rows)
                const rowsWithIdAndDuplicate = rows.map((i, index) => {
                    return {id: index, ...i, ['Duplicate with']: ''}
                })
                setHeaderWithIdAndDuplicate(headerWithIdAndDuplicate)
                setRowsWithIdAndDuplicate(rowsWithIdAndDuplicate)
            }

        }
        reader.readAsText(files[0]);
    }

    return (
        <div>
            {isValid
                ? <>
                    <ReactFileReader fileTypes={".csv"} handleFiles={handleFiles}>
                        <button className='btn'>Upload</button>
                    </ReactFileReader>
                    <table>
                        <Header headerNames={headerWithIdAndDuplicate}/>
                        <Rows rows={rowsWithIdAndDuplicate} headerNames={headerWithIdAndDuplicate}/>
                    </table>
                </>
                : <div>NO VALID</div>
            }


        </div>
    )
}

export default App;

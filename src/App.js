import './App.css';
import React, {useState} from 'react'
import ReactFileReader from 'react-file-reader'
import {parse} from 'papaparse'
import Header from "./Header";
import Rows from "./Rows";

function App() {

    const [headerWithIdAndDuplicate, setHeaderWithIdAndDuplicate] = useState([])
    const [rowsWithIdAndDuplicate, setRowsWithIdAndDuplicate] = useState([])
    const [isValidFile, setIsValidFile] = useState(true)

    const handleFiles = files => {

        if (files[0].name.slice(-3) !== 'csv') {
            setIsValidFile(false)
            return
        }
        let reader = new FileReader();

        reader.onloadend = function (e) {
            if (reader.result) {

                const headerNames = Object.keys(parse(reader.result, {
                    header: true,
                    transformHeader:function(h) {
                        return h.trim();
                    },
                }).data[0])

                const rows = (parse(reader.result, {

                    skipEmptyLines: true,
                    header: true,
                    transformHeader:function(h) {
                        return h.trim();
                    },
                    transform:function (i){
                        return i.trim()
                    }
                }).data)

                const headerWithIdAndDuplicate = (['id', ...headerNames, 'Duplicate with'])

                const rowsWithIdAndDuplicate = rows.map((i, index) => {
                    return {id: index, ...i, ['Duplicate with']: ''}
                })
                setHeaderWithIdAndDuplicate(headerWithIdAndDuplicate)
                setRowsWithIdAndDuplicate(rowsWithIdAndDuplicate)
            }else{
                setHeaderWithIdAndDuplicate([])
                setRowsWithIdAndDuplicate([])
            }

        }
        reader.readAsText(files[0]);

    }

    return (
        <div>
            {isValidFile
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

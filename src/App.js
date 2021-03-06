import './App.css';
import React from 'react'
import ReactFileReader from 'react-file-reader'
import {parse} from 'papaparse'

function App() {

        const handleFiles = files => {
            console.log(files[0].name)
            let reader = new FileReader();
            reader.onloadend = function (e){
                const header = Object.keys(parse(reader.result, {header: true}).data[0])
                const rows = (parse(reader.result, {header: true}).data)
                const headerWithIdAndDuplicate = (['id', ...header, 'Duplicate with'])
                console.log(rows)
                const rowsWithIdAndDuplicate = rows.map((i, index)=>{
                    return {id: index, ...i, ['Duplicate with']: ''}
                })
                console.log(headerWithIdAndDuplicate)
                console.log(rowsWithIdAndDuplicate)
            }
            reader.readAsText(files[0]);
        }

    return(
        <div>
            <ReactFileReader fileTypes={".csv"} handleFiles={handleFiles}>
            <button className='btn'>Upload</button>
        </ReactFileReader>
        </div>
    )
}
export default App;

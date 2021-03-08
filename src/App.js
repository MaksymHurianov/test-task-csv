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
    const [phonesArr, setPhonesArr] = useState([])

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
                if(headerNames.indexOf('Full Name') === -1 || headerNames.indexOf('Email') === -1 || headerNames.indexOf('Phone') === -1){
                    setIsValidFile(false)
                    return
                }

                const headerWithIdAndDuplicate = (['id', ...headerNames, 'Duplicate with'])

                function phoneValidation(i){
                    if(headerNames.indexOf('Phone') !== -1){
                        if(i['Phone'].slice(0,1)==='1' && i['Phone'].length === 11){
                            i['Phone'] = `+${i['Phone']}`

                        }else if(i['Phone'].length === 10){
                            i['Phone'] = `+1${i['Phone']}`
                        }
                    }
                }
                function hasChildrenValidation(i){

                    if(headerNames.indexOf('Has children') !== -1){
                        if(i['Has children'] === ''){
                            i['Has children'] = 'FALSE'
                        } else if((i['Has children'].toUpperCase() === 'FALSE') || (i['Has children'].toUpperCase() === 'TRUE')){
                            i['Has children'] = i['Has children'].toUpperCase()
                        }
                    }
                }
                function earlyIncomeValidation(i){
                    if(headerNames.indexOf('Yearly Income') !== -1){
                        if(i['Yearly Income'] !== '' && i['Yearly Income'] < 1000000){
                            i['Yearly Income'] = ((+i['Yearly Income']).toFixed(2))
                            console.log(i['Yearly Income'])
                        }
                    }
                }

                const rowsWithIdAndDuplicate = rows.map((i, index) => {
                    phoneValidation(i)
                    hasChildrenValidation(i)
                    earlyIncomeValidation(i)
                    return {id: index, ...i, 'Duplicate with': ''}
                })
                setPhonesArr(rows.map(i=>{
                    return i['Phone']
                }))
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
                        <Rows rows={rowsWithIdAndDuplicate}
                              headerNames={headerWithIdAndDuplicate}
                              phonesArr={phonesArr}
                        />
                    </table>
                </>
                : <div>NO VALID</div>
            }
        </div>
    )
}

export default App;

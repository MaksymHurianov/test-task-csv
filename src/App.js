import './App.css';
import React, {useState} from 'react'
import ReactFileReader from 'react-file-reader'
import {parse} from 'papaparse'
import Header from "./Header";
import Rows from "./Rows";
import Error from "./Error";

function App() {

    const [headerWithIdAndDuplicate, setHeaderWithIdAndDuplicate] = useState([])
    const [rowsWithIdAndDuplicate, setRowsWithIdAndDuplicate] = useState([])
    const [isValidFile, setIsValidFile] = useState(true)
    const [phonesArr, setPhonesArr] = useState([])
    const [emailsArr, setEmailsArr] = useState([])
    const reducedStatesArr = []
    const states = {
        alabama: 'AL',
        alaska: 'AK',
        arizona: 'AZ',
        arkansas: 'AR',
        california: 'CA',
        colorado: 'CO',
        connecticut: 'CT',
        delaware: 'DE',
        florida: 'FL',
        georgia: 'GA',
        hawaii: 'HI',
        idaho: 'ID',
        illinois: 'IL',
        indiana: 'IN',
        iowa: 'IA',
        kansas: 'KS',
        kentucky: 'KY',
        louisiana: 'LA',
        maine: 'ME',
        maryland: 'MD',
        massachusetts: 'MA',
        michigan: 'MI',
        minnesota: 'MN',
        mississippi: 'MS',
        missouri: 'MO',
        montana: 'MT',
        nebraska: 'NE',
        nevada: 'NV',
        'new hampshire': 'NH',
        'new jersey': 'NJ',
        'new mexico': 'NM',
        'new york': 'NY',
        'north carolina': 'NC',
        'north dakota': 'ND',
        ohio: 'OH',
        oklahoma: 'OK',
        oregon: 'OR',
        pennsylvania: 'PA',
        'rhode island': 'RI',
        'south carolina': 'SC',
        'south dakota': 'SD',
        tennessee: 'TN',
        texas: 'TX',
        utah: 'UT',
        vermont: 'VT',
        virginia: 'VA',
        washington: 'WA',
        'west virginia': 'WV',
        wisconsin: 'WI',
        wyoming: 'WY'
    }
    const statesArr = (Object.keys(states))

    for (let key in states) {
        reducedStatesArr.push(states[key])
    }

    const handleFiles = files => {

        if (files[0].name.slice(-3) !== 'csv') {
            setIsValidFile(false)
            return
        } else {
            setIsValidFile(true)
        }
        let reader = new FileReader();

        reader.onloadend = function (e) {

            if (reader.result) {

                const headerNames = Object.keys(parse(reader.result, {
                    header: true,
                    transformHeader: function (h) {
                        return h.trim();
                    },
                }).data[0])

                const rows = (parse(reader.result, {
                    skipEmptyLines: true,
                    header: true,
                    transformHeader: function (h) {
                        return h.trim();
                    },
                    transform: function (i) {
                        return i.trim()
                    }
                }).data)
                if (headerNames.indexOf('Full Name') === -1 || headerNames.indexOf('Email') === -1 || headerNames.indexOf('Phone') === -1) {
                    setIsValidFile(false)
                    return
                }

                const headerWithIdAndDuplicate = (['id', ...headerNames, 'Duplicate with'])

                function phoneValidation(i) {
                    if (headerNames.indexOf('Phone') !== -1) {
                        if (i['Phone'].slice(0, 1) === '1' && i['Phone'].length === 11) {
                            i['Phone'] = `+${i['Phone']}`

                        } else if (i['Phone'].length === 10) {
                            i['Phone'] = `+1${i['Phone']}`
                        }
                    }
                }

                function hasChildrenValidation(i) {
                    if (headerNames.indexOf('Has children') !== -1) {
                        if (i['Has children'] === '') {
                            i['Has children'] = 'FALSE'
                        } else if ((i['Has children'].toUpperCase() === 'FALSE') || (i['Has children'].toUpperCase() === 'TRUE')) {
                            i['Has children'] = i['Has children'].toUpperCase()
                        }
                    }
                }

                function earlyIncomeValidation(i) {
                    if (headerNames.indexOf('Yearly Income') !== -1) {
                        if (i['Yearly Income'] !== '' && i['Yearly Income'] < 1000000) {
                            i['Yearly Income'] = ((+i['Yearly Income']).toFixed(2))
                        }
                    }
                }

                function licenseStatesValidation(i) {
                    let reducedStatesArrItem = []
                    if (headerNames.indexOf('License states') !== -1) {
                        if (i['License states'].indexOf('|') !== -1) {
                            let state = i['License states'].split('|')
                            for (let i = 0; i < state.length; ++i) {
                                if ((reducedStatesArr).indexOf(state[i].trim()) !== -1) {
                                    reducedStatesArrItem.push(state[i].trim())
                                } else {
                                    let stateTrimmed = (state[i].trim().toLowerCase())
                                    reducedStatesArrItem.push(statesArr.indexOf(stateTrimmed) !== -1 ? states[stateTrimmed] : 'not valid')
                                }
                            }
                            i['License states'] = reducedStatesArrItem.join(' | ')

                        } else {
                            if ((reducedStatesArr).indexOf(i['License states']) !== -1) {
                            } else {
                                i['License states'] = ((statesArr.indexOf(i['License states'].toLowerCase()) !== -1)
                                    ? states[statesArr[statesArr.indexOf(i['License states'].toLowerCase())]] : 'not valid')
                            }
                        }
                    }
                }

                const rowsWithIdAndDuplicate = rows.map((i, index) => {

                    phoneValidation(i)
                    hasChildrenValidation(i)
                    earlyIncomeValidation(i)
                    licenseStatesValidation(i)

                    return {id: index, ...i, 'Duplicate with': ''}
                })
                setPhonesArr(rows.map(i => {
                    return i['Phone']
                }))
                setEmailsArr(rows.map(i => {
                    return i['Email']
                }))

                setHeaderWithIdAndDuplicate(headerWithIdAndDuplicate)
                setRowsWithIdAndDuplicate(rowsWithIdAndDuplicate)
            } else {
                setHeaderWithIdAndDuplicate([])
                setRowsWithIdAndDuplicate([])
            }

        }
        reader.readAsText(files[0]);

    }

    return (
        <div className={'app'}>
            <ReactFileReader fileTypes={".csv"} handleFiles={handleFiles}>
                <button className='btn'>Import users</button>
            </ReactFileReader>
            {isValidFile
                ? <table>
                    <Header headerNames={headerWithIdAndDuplicate}/>
                    <Rows rows={rowsWithIdAndDuplicate}
                          headerNames={headerWithIdAndDuplicate}
                          phonesArr={phonesArr}
                          emailsArr={emailsArr}
                    />
                </table>
                : <Error/>
            }
        </div>
    )
}

export default App;

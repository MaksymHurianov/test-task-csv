import React from 'react'

function Rows({rows, headerNames, phonesArr}) {

    console.log(phonesArr)
    console.log(rows)
    return (
        <tbody>

        {rows.map((row, index, rows) => {
            let styledRows = []
            let stylePhone = {}

            for (let i = 0; i < headerNames.length; ++i) {


                const styleAge = (row['Age'] < 21 || !+row['Age']) && headerNames[i] === 'Age' ? {backgroundColor: 'red'} : undefined
                const styleExperience = (+row['Experience'] <= 0 || row['Age'] - row['Experience'] < 0) && headerNames[i] === 'Experience' ? {backgroundColor: 'red'} : undefined

                if (row['Phone']) {
                    stylePhone = (row['Phone'].length !== 12 || row['Phone'].slice(0, 2) !== '+1') && headerNames[i] === 'Phone' ? {backgroundColor: 'red'} : undefined
                }else{
                    stylePhone = headerNames[i] === 'Phone' ? {backgroundColor: 'red'} : undefined
                }

                const styleDate = !((/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(row['Expiration date']) || (/(0[1-9]|1[012])[ /.](0[1-9]|[12][0-9]|3[01])[ /.](19|20)\d\d/.test(row['Expiration date'])))
                    && Date.parse(row['Expiration date']) > Date.now()) && headerNames[i] === 'Expiration date' ? {backgroundColor: 'red'} : undefined

                const styleLicenceNumber = !(/^[a-zA-Z\d]{5}$/).test(row['License number']) && headerNames[i] === 'License number'? {backgroundColor: 'red'} : undefined
                const styleEmail = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(row['Email']) && headerNames[i] === 'Email'? {backgroundColor: 'red'} : undefined
                const styleHasChildren = !((row['Has children'] === ('TRUE')) || (row['Has children'] === ('FALSE'))) && headerNames[i] === 'Has children'? {backgroundColor: 'red'} : undefined
                const styleYearlyIncome = !(+row['Yearly Income'] && +row['Yearly Income'] < 1000000) && headerNames[i] === 'Yearly Income'? {backgroundColor: 'red'} : undefined

                const styleAll = {...styleAge, ...styleExperience, ...stylePhone, ...styleDate, ...styleLicenceNumber, ...styleEmail, ...styleHasChildren, ...styleYearlyIncome}



                styledRows = [...styledRows, (<td key={i} style={styleAll}>{rows[index][headerNames[i]]}</td>)]
            }
            return (
                <tr key={index}>
                    {styledRows}
                </tr>
            )
        })}

        </tbody>
    )
}

export default Rows
import React from 'react'

function Rows({rows, headerNames}){

    return(
        <tbody>
        {rows.map((row, index, rows)=>{

            let a = []
            for(let i=0; i < headerNames.length; ++i){

                const style =(row['Age'] < 21 || !+row['Age']) && headerNames[i] === 'Age' ? {backgroundColor: 'red'}: undefined
                    a = [...a, (<td key={i} style={style}>{rows[index][headerNames[i]]}</td>)]
            }
            return(
                <tr key={index}>
                    {a}
                </tr>
            )
        })}

        </tbody>
    )
}
export default Rows
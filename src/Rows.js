import React from 'react'

function Rows({rows, headerNames}){

    return(
        <tbody>
        {rows.map((row, index, rows)=>{
            let a = []
            for(let i=0; i < headerNames.length; ++i){
                if (rows) {
                    a = [...a, (<td key={i}>{rows[index][headerNames[i]]}</td>)]
                }
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
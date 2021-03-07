import React from 'react'

function Header({headerNames}){

    return(
        <thead className={'header'}>
        <tr>
            {headerNames.map((name, index) => {
                return <td key={index}>{name}</td>
            })}
        </tr>
        </thead>
    )
}
export default Header
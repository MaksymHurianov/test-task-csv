import React from 'react'

function Error(){

    const styleErrorField = {
        backgroundColor: '#f65337',
        border: '1px solid black',
        width: '500px',
        margin: 'auto',
        marginTop: '150px'
    }
    const styleText = {
        textAlign: 'center',
        fontSize: '20px',
        padding: '20px'
    }
    return(
            <div style={styleErrorField}>
                <p style={styleText}>File format is not correct</p>
            </div>

    )
}
export default Error
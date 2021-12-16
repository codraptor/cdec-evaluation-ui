import * as React from 'react';
import { FieldProps } from 'formik';  
import { TextField } from '@material-ui/core';

interface Props extends FieldProps {
    type : string;
    placeholder: string;
}

export const MyField: React.FC<Props> = ({placeholder, type, field }) => {

    return (<TextField 
        inputProps={{style: {fontSize: 25, textAlign: "center", fontFamily: "'Cabin', sans-serif", 
        border: "1px solid #40e0d0",
        color: "white"}}}
        type={type}
        placeholder={placeholder}
        {... field} />);

}
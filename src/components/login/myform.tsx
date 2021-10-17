import { Button } from '@material-ui/core';
import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { MyField } from './myfield';

interface Values {
    phone: string;
};

interface Props {
    onSubmit: (values: Values) => void;
};

export const MyForm: React.FC<Props> = ({onSubmit}) => {
    return (
        <Formik initialValues={{phone:''}} onSubmit={(values) => {
            onSubmit(values)
        }}>
            {({values}) => (
                    <Form>
                        <div style={{ marginTop :10 }} >
                        <Field name="phone" label="Phone" placeholder="Phone" component={MyField}/>
                        </div>
                        <br/>
                        <Button style={{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin',
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#40e0d0" , fontSize: 18 , boxShadow: "0px 0px 6px #40e0d0"
                        }} type="submit" >Submit</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};
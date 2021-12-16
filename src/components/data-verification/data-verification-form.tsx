import { Button } from '@material-ui/core';
import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { MyField } from '../login/myfield';
import { useHistory } from 'react-router-dom';


interface Values {
    option: string;
};

interface Props {
    onSubmit: (values: Values) => void;
};

export const OTPVerificationForm: React.FC<Props> = ({onSubmit}) => {

    const history = useHistory();

    return (
        <Formik initialValues={{option:''}} onSubmit={(values) => {
            onSubmit(values)
        }}>
            {({values}) => (
                    <Form>
                        <Button style={{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin',
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#40e0d0" , fontSize: 18 , boxShadow: "0px 0px 6px #40e0d0"
                        }}  type="submit" >Submit</Button>
                        <Button style= {{ color: "#000", fontWeight: 600, paddingLeft: 40, 
                        fontFamily: 'Cabin', marginLeft : 10,
                        paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
                        background : "#fff" , fontSize: 18 , boxShadow: "0px 0px 6px #fff"
                        }}
                        
                        type="button" onClick={(() => {
              history.push("/");
          })}>Go Back</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};
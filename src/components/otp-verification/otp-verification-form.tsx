import { Button } from '@material-ui/core';
import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { MyField } from '../login/myfield';
import { useHistory } from 'react-router-dom';


interface Values {
    password: string;
};

interface Props {
    onSubmit: (values: Values) => void;
};

export const OTPVerificationForm: React.FC<Props> = ({onSubmit}) => {

    const history = useHistory();

    return (
        <Formik initialValues={{password:''}} onSubmit={(values) => {
            onSubmit(values)
        }}>
            {({values}) => (
                    <Form>
                        <div style={{ marginTop :10 }} >
                        <Field name="password" label="Password" placeholder="Password" component={MyField}/>
                        </div>
                        <br/>
                        <Button style={{ color: "#fff", paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#173D7A" , fontSize: 15, boxShadow: "0px 0px 6px #9E9E9E" }}  type="submit" >Submit</Button>
                        <Button style={{ color: "#000", paddingLeft: 40, marginLeft : 10, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#fff" , fontSize: 15, boxShadow: "0px 0px 6px #9E9E9E" }}  type="button" onClick={(() => {
              history.push("/");
          })}>Go Back</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};
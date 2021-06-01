import * as React from "react";


type Props = {
    children: React.ReactNode
};

export type UserContextType = {
    mobile: string;
    updateMobile: (newMobile: string) => void;
}

export const UserContext = React.createContext<UserContextType>(
    {
        mobile:"",
        updateMobile: newMobile => console.warn('no theme provider')
    });

    
export const useMobile = () => React.useContext(UserContext);

export const UserContextProvider = ({children}: Props) => {

  const [mobile, setMobile] = React.useState("");

  const updateMobile = (newMobile: string) => {
    console.log("Updating mobile number to:" + newMobile);
    setMobile(newMobile);
    console.log("Current mobile number is" + mobile);
  };

  return (
    <UserContext.Provider value={{mobile, updateMobile}}>
      {children}
    </UserContext.Provider>
    );

};
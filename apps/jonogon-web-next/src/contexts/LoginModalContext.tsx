'use client';

import LoginModal from '@/components/custom/LoginModal';
import React, {createContext, useContext, useState} from 'react';

interface LoginModalContextProps {
    isOpen: boolean;
    openModal: (redirectUrl?: string) => void;
    closeModal: () => void;
    redirectUrl?: string;
}

const LoginModalContext = createContext<LoginModalContextProps | undefined>(
    undefined,
);

export const useLoginModal = () => {
    const context = useContext(LoginModalContext);
    if (!context) {
        throw new Error(
            'useLoginModal must be used within a LoginModalProvider',
        );
    }
    return context;
};

export const LoginModalProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string | undefined>(
        undefined,
    );

    const openModal = (url?: string) => {
        setRedirectUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setRedirectUrl(undefined);
    };

    return (
        <LoginModalContext.Provider
            value={{isOpen, openModal, closeModal, redirectUrl}}
        >
            {children}
            <LoginModal />
        </LoginModalContext.Provider>
    );
};

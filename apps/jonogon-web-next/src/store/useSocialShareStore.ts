import {create} from 'zustand';

type ModalStore = {
    isOpen: boolean;
    openShareModal: () => void;
    closeShareModal: () => void;
};

export const useSocialShareStore = create<ModalStore>((set) => ({
    isOpen: false,
    openShareModal: () => set({isOpen: true}),
    closeShareModal: () => set({isOpen: false}),
}));

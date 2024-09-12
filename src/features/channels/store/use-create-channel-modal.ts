import { atom, useAtom } from "jotai";
const createWorkspaceModalAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(createWorkspaceModalAtom);
};

import React from 'react';
import EditLoggedOutDraftPetition from './_page';

export const runtime = 'edge';

export default async function PetitionDraftStatic() {
    return (
        <EditLoggedOutDraftPetition />
    );
}

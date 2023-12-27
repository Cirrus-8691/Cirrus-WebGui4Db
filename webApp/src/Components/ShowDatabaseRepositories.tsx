import { useContext, useState } from "react";
import { MainContext } from "../App";
import DialogOffCanvas from "./DialogOffCanvas";
import { Button, Stack } from "react-bootstrap";

export default function ShowDatabaseRepositories() {

    const mainContext = useContext(MainContext);
    const [showInputRepositories, setShowInputRepositories] = useState(false);

    const onSelectRepository = (collectionName: string) => {
        mainContext.setDatabaseRepository(collectionName);
        setShowInputRepositories(false);
    }

    //TODO: Add collection

    return (
        <DialogOffCanvas titleDialog={`🗃️ ${mainContext.databaseConnexion.repositoriesName()}`}
            open={showInputRepositories}
            setOpen={setShowInputRepositories}
            titleButton={`🗃️ ${mainContext.databaseConnexion.repositoriesName()}: ${mainContext.databaseRepository.toString()}`}>

            <Stack gap={2}>
                {
                    mainContext.databaseRepositories.map((repositoryName : string, index : number) =>
                        <Button key={index} onClick={() => onSelectRepository(repositoryName)}
                            variant={repositoryName === mainContext.databaseRepository ? "primary" : "secondary"}>
                            {repositoryName}
                        </Button>
                    )
                }
            </Stack>

        </DialogOffCanvas>
    );

}


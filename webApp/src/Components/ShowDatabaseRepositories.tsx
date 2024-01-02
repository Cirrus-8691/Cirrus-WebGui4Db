import { useContext, useState } from "react";
import { MainContext } from "../App";
import DialogOffCanvas from "./DialogOffCanvas";
import { Button, Stack } from "react-bootstrap";
import { Repository } from "../Controllers/TestConnection";

export default function ShowDatabaseRepositories() {

    const mainContext = useContext(MainContext);
    const [showInputRepositories, setShowInputRepositories] = useState(false);

    const onSelectRepository = (repository: Repository) => {
        mainContext.setDatabaseRepository(repository);
        setShowInputRepositories(false);
    }

    //TODO: Add repository

    return (
        <DialogOffCanvas titleDialog={`🗃️ ${mainContext.databaseConnexion.repositoriesName()}`}
            open={showInputRepositories}
            setOpen={setShowInputRepositories}
            titleButton={`🗃️ ${mainContext.databaseConnexion.repositoriesName()}: ${mainContext.databaseRepository.name}`}>

            <Stack gap={2}>
                {
                    mainContext.databaseRepositories.map((repository: Repository, index: number) =>
                        <Button key={index} onClick={() => onSelectRepository(repository)}
                            variant={repository.name === mainContext.databaseRepository.name ? "primary" : "secondary"}>
                            {repository.name}
                        </Button>
                    )
                }
            </Stack>
        </DialogOffCanvas>
    );

}


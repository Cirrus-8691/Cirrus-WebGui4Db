import { useContext, useState } from "react";
import { MainContext } from "../App";
import DialogOffCanvas from "./DialogOffCanvas";
import { Button, Stack } from "react-bootstrap";

export default function ShowMongoCollection() {

    const mainContext = useContext(MainContext);
    const [showInputCollections, setShowInputCollections] = useState(false);

    const onSelectCollection = (collectionName: string) => {
        mainContext.setMongoCollection(collectionName);
        localStorage.setItem("Cirrus-WebGui4Db-MongoCollection", collectionName);
        setShowInputCollections(false);
    }

    //TODO: Add collection

    return (
        <DialogOffCanvas titleDialog="🗃️ Collections"
            open={showInputCollections}
            setOpen={setShowInputCollections}
            titleButton={"🗃️ Collection: " + mainContext.mongoCollection.toString()}>

            <Stack gap={2}>
                {
                    mainContext.mongoCollections.map((collectionName : string, index : number) =>
                        <Button key={index} onClick={() => onSelectCollection(collectionName)}
                            variant={collectionName === mainContext.mongoCollection ? "primary" : "secondary"}>
                            {collectionName}
                        </Button>
                    )
                }
            </Stack>

        </DialogOffCanvas>
    );

}


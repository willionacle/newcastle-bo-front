import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { findSpecialGameAPI } from "@/api/special-games/get";
import SpecialGamesForm from "./SpecialGamesForm";
import ChoicesForm from "./ChoicesForm";

const SpecialGamesCreate = () => {
  const { id } = useParams();
  const { data, isLoading, mutate } = findSpecialGameAPI(id);

  return (
    <Card>
      <Breadcrumb
        replace={id ? i18next.t("specialGames.editTitle") : i18next.t("specialGames.createTitle")}
      />
      <Divider />
      {isLoading && id ? (
        <div style={{ textAlign: "center", padding: "50px" }}>{i18next.t("global.waiting")}</div>
      ) : (
        <>
          <SpecialGamesForm data={data} />
          {data && (
            <>
              <Divider />
              <ChoicesForm data={data} mutate={mutate} />
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default SpecialGamesCreate;

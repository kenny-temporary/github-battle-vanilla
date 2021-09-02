import queryRepositoty from "./scripts/services.js";
import presit from "./scripts/presit.js";

function PopularLanguages({ languages, onUpdate, checked }) {
  return (
    <div className="text-center d-flex justify-content-center my-5">
      {languages?.map((language) => {
        return (
          <li
            className="px-4 py-2 languageItem"
            key={language}
            onClick={() => onUpdate && onUpdate(language)}
            style={{ color: checked === language ? "red" : "green" }}
          >
            {language}
          </li>
        );
      })}
    </div>
  );
}

function PopularList({ repositoties, onNextUpdate, checked, canLoadMore }) {
  return (
    <div style={{ color: "green" }}>
      <div className="row justify-content-around">
        {repositoties?.map((repositoty, key) => (
          <Card key={repositoty?.id} data={repositoty} index={key + 1} />
        ))}
      </div>
      {canLoadMore && (
        <button onClick={() => onNextUpdate && onNextUpdate(checked)}>
          下一页数据
        </button>
      )}
    </div>
  );
}

function Card({ data, index }) {
  return (
    <div className="col col-3 py-4 px-5" style={{ border: "1px solid red" }}>
      <h2 className="text-center">#{index}</h2>
      <div className="aspectRatioImageContainer">
        <img src={data?.owner?.avatar_url} className="avatar w-70" alt="card-item" />
      </div>
      <div>
        <a href={data?.html_url}>{data?.name}</a>
      </div>
      <ul>
        <li>
          <a href={data?.owner?.html_url} target="_blank">
            {data?.owner?.login}
          </a>
        </li>
        <li>{data?.stargazers_count} stars</li>
        <li>{data?.forks_count} forks</li>
        <li>{data?.open_issues_count} open issues</li>
      </ul>
    </div>
  );
}

function Popular() {
  const [repositoties, setRepositoties] = React.useState([]);
  const [languages] = React.useState(presit.initialLanguages);
  const [canLoadMore, setCanLoadMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(presit.initialPage);
  const [checkedLanguage, setCheckedLanguage] = React.useState(
    presit.initialLanguages[0]
  );
  const [loading, setLoading] = React.useState(false);

  const setRepositotiesAsync = (currentLanguage, page, type) => {
    setLoading(true);

    queryRepositoty({ language: currentLanguage, page }).then(
      (repositoties) => {
        setCanLoadMore(!repositoties.data?.incomplete_results);

        setRepositoties((previous) => {
          const results =
            type === presit.RepositoriesUpdateStatus.Init
              ? repositoties?.data?.items
              : [...previous, ...repositoties?.data?.items];
          return results;
        });
      }
    ).finally(() => {
      setLoading(false)
    });
  };

  const handleNextUpdate = (language) => {
    const nextPage = currentPage + 1;
    setRepositotiesAsync(
      language,
      nextPage,
      presit.RepositoriesUpdateStatus.Add
    );
    setCurrentPage(nextPage);
  };

  React.useEffect(() => {
    setRepositotiesAsync(
      checkedLanguage,
      presit.initialPage,
      presit.RepositoriesUpdateStatus.Init
    );
  }, [checkedLanguage]);

  return (
    <div className="container d-flex flex-column">
      <PopularLanguages
        languages={languages}
        onUpdate={setCheckedLanguage}
        checked={checkedLanguage}
      />
      <antd.Spin spinning={loading}>
        <PopularList
          repositoties={repositoties}
          checked={checkedLanguage}
          onNextUpdate={handleNextUpdate}
          canLoadMore={canLoadMore}
        />
      </antd.Spin>
    </div>
  );
}

function start(container) {
  ReactDOM.render(<Popular />, document.getElementById(container));
}
start("root");

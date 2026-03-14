import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const SearchInput = ({ placeholderKey = "Qidirish..." }) => {
  const router = useRouter();
  const intl = useIntl();

  const querySearch = router.query.search || "";
  const [searchValue, setSearchValue] = useState(querySearch);

  useEffect(() => {
    if (searchValue === querySearch) return;

    const delayDebounceFn = setTimeout(() => {
      const params = { ...router.query };

      if (searchValue) {
        params.search = searchValue;
      } else {
        delete params.search;
      }
      params.page = 1;

      router.push({ query: params }, undefined, { shallow: true });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, querySearch]);

  useEffect(() => {
    setSearchValue(querySearch);
  }, [querySearch]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search
          size={18}
          className={searchValue ? "text-primary" : "text-slate-400"}
        />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={intl.formatMessage({ id: placeholderKey })}
        className="w-full bg-white border border-gray-100 py-3 pl-12 pr-10 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-orange-50 focus:border-primary transition-all outline-none"
      />
      {searchValue && (
        <button
          type="button" // Form ichida bo'lsa submit bo'lib ketmasligi uchun
          onClick={() => setSearchValue("")}
          className="absolute inset-y-0 right-3 flex items-center px-2 text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

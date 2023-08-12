import { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, InputBase } from "@mui/material";

export const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

interface IData {
    searchValue: string;
    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function SearchBar(props: IData) {
    return (
        <div>
            <Search
                sx={{
                    backgroundColor: "#F1F1F1",
                    m: 1,
                    "&:hover": { backgroundColor: "#C5C5C5" },
                }}
            >
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    onChange={props.handleSearch}
                    value={props.searchValue}
                />
            </Search>
        </div>
    );
}

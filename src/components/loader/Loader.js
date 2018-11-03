import React from "react";
import * as Spinners from "react-spinners";

const DEFAULT_COLOR = "#343a40";

export function BarLoader({ width = 60, ...props} = {}) {
    return (
        <Spinners.BarLoader color={DEFAULT_COLOR} loading={true} height={5} width={width} {...props} />
    )
}

export function PropagateLoader(props = {}) {
    return (
        <Spinners.PropagateLoader color={DEFAULT_COLOR} size={20} {...props} />
    )
}

export function TronLoader({options = {}, children = null, height = 70, ...props}) {

    return (

        <div className="container">

            <div className=" p-4 m-4 text-center">
            <img
                src="data:image/svg+xml;base64,PCEtLT94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8tLT4KPCEtLSBDcmVhdGVkIHdpdGggSW5rc2NhcGUgKGh0dHA6Ly93d3cuaW5rc2NhcGUub3JnLykgLS0+Cgo8c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIHdpZHRoPSIxNDIuOTQ0NjltbSIgaGVpZ2h0PSIxNjUuNDIyMzJtbSIgdmlld0JveD0iMCAwIDE0Mi45NDQ2OSAxNjUuNDIyMzIiIHZlcnNpb249IjEuMSIgaWQ9InN2ZzE1MiIgaW5rc2NhcGU6dmVyc2lvbj0iMC45Mi4yICg1YzNlODBkLCAyMDE3LTA4LTA2KSIgc29kaXBvZGk6ZG9jbmFtZT0idHJvbi1sb2dvLnN2ZyIgc3R5bGU9IiI+CiAgPGRlZnMgaWQ9ImRlZnMxNDYiPjwvZGVmcz4KICA8c29kaXBvZGk6bmFtZWR2aWV3IGlkPSJiYXNlIiBwYWdlY29sb3I9IiNmZmZmZmYiIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiBib3JkZXJvcGFjaXR5PSIxLjAiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiIGlua3NjYXBlOnpvb209IjAuOTg5OTQ5NDkiIGlua3NjYXBlOmN4PSI4MjcuMzc2NDMiIGlua3NjYXBlOmN5PSIxMjcuMzA0MjQiIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIiBzaG93Z3JpZD0iZmFsc2UiIGZpdC1tYXJnaW4tdG9wPSIwIiBmaXQtbWFyZ2luLWxlZnQ9IjAiIGZpdC1tYXJnaW4tcmlnaHQ9IjAiIGZpdC1tYXJnaW4tYm90dG9tPSIwIiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjM3MDYiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjIwNDkiIGlua3NjYXBlOndpbmRvdy14PSIxMzQiIGlua3NjYXBlOndpbmRvdy15PSI1NSIgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSI+PC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPG1ldGFkYXRhIGlkPSJtZXRhZGF0YTE0OSI+CiAgICA8cmRmOnJkZj4KICAgICAgPGNjOndvcmsgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiPjwvZGM6dHlwZT4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzp3b3JrPgogICAgPC9yZGY6cmRmPgogIDwvbWV0YWRhdGE+CiAgPGcgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjM5NTEyNzEsLTMuMDU0NDI3NykiPgogICAgPHBhdGggc3R5bGU9ImRpc3BsYXk6IGlubGluZTsgZmlsbDogcmdiKDE5NywgNDgsIDM5KTsgZmlsbC1vcGFjaXR5OiAxOyBzdHJva2U6IHJnYigxOTcsIDQ4LCAzOSk7IHN0cm9rZS13aWR0aDogNzsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgc3Ryb2tlLW9wYWNpdHk6IDE7IiBkPSJNIDc0LjU5MDk0MSw2NC42MTI1NTMgNC45NDM1ODc5LDYuNjAxMzQ2NSIgaWQ9InBhdGg0NTMyLTMiIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2MiIGNsYXNzPSJHZkRIQndGUl8wIj48L3BhdGg+CiAgICA8cGF0aCBzdHlsZT0iZGlzcGxheTogaW5saW5lOyBmaWxsOiByZ2IoMTk3LCA0OCwgMzkpOyBmaWxsLW9wYWNpdHk6IDE7IHN0cm9rZTogcmdiKDE5NywgNDgsIDM5KTsgc3Ryb2tlLXdpZHRoOiA3OyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiA0OyBzdHJva2Utb3BhY2l0eTogMTsiIGQ9Ik0gNC45NDM1ODc5LDYuNjAxMzQ2NSAxMTQuODk5MDksMzMuMjAyNTc2IiBpZD0icGF0aDQ1MzgtNSIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgY2xhc3M9IkdmREhCd0ZSXzEiPjwvcGF0aD4KICAgIDxwYXRoIHN0eWxlPSJkaXNwbGF5OiBpbmxpbmU7IGZpbGw6IHJnYigxOTcsIDQ4LCAzOSk7IGZpbGwtb3BhY2l0eTogMTsgc3Ryb2tlOiByZ2IoMTk3LCA0OCwgMzkpOyBzdHJva2Utd2lkdGg6IDc7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IHN0cm9rZS1vcGFjaXR5OiAxOyIgZD0iTSAxMTQuODk5MDksMzMuMjAyNTc2IDc0LjU5MDk0MSw2NC42MTI1NTMiIGlkPSJwYXRoNDU0MC02IiBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiBzb2RpcG9kaTpub2RldHlwZXM9ImNjIiBjbGFzcz0iR2ZESEJ3RlJfMiI+PC9wYXRoPgogICAgPHBhdGggc3R5bGU9ImRpc3BsYXk6IGlubGluZTsgZmlsbDogcmdiKDE5NywgNDgsIDM5KTsgZmlsbC1vcGFjaXR5OiAxOyBzdHJva2U6IHJnYigxOTcsIDQ4LCAzOSk7IHN0cm9rZS13aWR0aDogNzsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgc3Ryb2tlLW9wYWNpdHk6IDE7IiBkPSJNIDc0LjU5MDk0MSw2NC42MTI1NTMgNjEuOTgyNDE4LDE2NC45MjcyOCIgaWQ9InBhdGg0NTQyLTIiIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2MiIGNsYXNzPSJHZkRIQndGUl8zIj48L3BhdGg+CiAgICA8cGF0aCBzdHlsZT0iZGlzcGxheTogaW5saW5lOyBmaWxsOiByZ2IoMTk3LCA0OCwgMzkpOyBmaWxsLW9wYWNpdHk6IDE7IHN0cm9rZTogcmdiKDE5NywgNDgsIDM5KTsgc3Ryb2tlLXdpZHRoOiA3OyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiA0OyBzdHJva2Utb3BhY2l0eTogMTsiIGQ9Ik0gNC45NDM1ODc5LDYuNjAxMzQ2NSA2MS45ODI0MTgsMTY0LjkyNzI4IiBpZD0icGF0aDQ1NDQtOSIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgY2xhc3M9IkdmREhCd0ZSXzQiPjwvcGF0aD4KICAgIDxwYXRoIHN0eWxlPSJkaXNwbGF5OiBpbmxpbmU7IGZpbGw6IHJnYigxOTcsIDQ4LCAzOSk7IGZpbGwtb3BhY2l0eTogMTsgc3Ryb2tlOiByZ2IoMTk3LCA0OCwgMzkpOyBzdHJva2Utd2lkdGg6IDc7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IHN0cm9rZS1vcGFjaXR5OiAxOyIgZD0iTSAxNDAuNzkwNDUsNTUuMzE0MTkzIDYxLjk4MjQxOCwxNjQuOTI3MjgiIGlkPSJwYXRoNDU0Ni0xIiBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiBzb2RpcG9kaTpub2RldHlwZXM9ImNjIiBjbGFzcz0iR2ZESEJ3RlJfNSI+PC9wYXRoPgogICAgPHBhdGggc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2M1MzAyNztmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2M1MzAyNztzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMnB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiIGQ9Im0gMTE2Ljg4MzQ2LDMxLjUwMTY4NiBjIDAuMDk0NSwwLjIyMDQ5IDAuMTg4OTksMC40NDA5NyAwLjI4MzQ4LDAuNjYxNDYiIGlkPSJwYXRoNDU0OC0yIiBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiBjbGFzcz0iR2ZESEJ3RlJfNiI+PC9wYXRoPgogICAgPHBhdGggc3R5bGU9ImRpc3BsYXk6IGlubGluZTsgZmlsbDogcmdiKDE5NywgNDgsIDM5KTsgZmlsbC1vcGFjaXR5OiAxOyBzdHJva2U6IHJnYigxOTcsIDQ4LCAzOSk7IHN0cm9rZS13aWR0aDogNzsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgc3Ryb2tlLW9wYWNpdHk6IDE7IiBkPSJtIDExNC44OTkwOSwzMy4yMDI1NzYgMjUuODkxMzYsMjIuMTExNjE3IiBpZD0icGF0aDQ1NTAtNyIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgc29kaXBvZGk6bm9kZXR5cGVzPSJjYyIgY2xhc3M9IkdmREhCd0ZSXzciPjwvcGF0aD4KICAgIDxwYXRoIHN0eWxlPSJkaXNwbGF5OiBpbmxpbmU7IGZpbGw6IHJnYigxOTcsIDQ4LCAzOSk7IGZpbGwtb3BhY2l0eTogMTsgc3Ryb2tlOiByZ2IoMTk3LCA0OCwgMzkpOyBzdHJva2Utd2lkdGg6IDc7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IHN0cm9rZS1vcGFjaXR5OiAxOyIgZD0ibSAxNDAuNzkwNDUsNTUuMzE0MTkzIC02Ni4xOTk1MDksOS4yOTgzNiIgaWQ9InBhdGg0NTUyLTAiIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2MiIGNsYXNzPSJHZkRIQndGUl84Ij48L3BhdGg+CiAgPC9nPgo8c3R5bGUgZGF0YS1tYWRlLXdpdGg9InZpdnVzLWluc3RhbnQiPi5HZkRIQndGUl8we3N0cm9rZS1kYXNoYXJyYXk6OTEgOTM7c3Ryb2tlLWRhc2hvZmZzZXQ6OTI7YW5pbWF0aW9uOkdmREhCd0ZSX2RyYXdfMCAxOTAwbXMgZWFzZSAwbXMgaW5maW5pdGUsR2ZESEJ3RlJfZmFkZSAxOTAwbXMgbGluZWFyIDBtcyBpbmZpbml0ZTt9LkdmREhCd0ZSXzF7c3Ryb2tlLWRhc2hhcnJheToxMTQgMTE2O3N0cm9rZS1kYXNob2Zmc2V0OjExNTthbmltYXRpb246R2ZESEJ3RlJfZHJhd18xIDE5MDBtcyBlYXNlIDBtcyBpbmZpbml0ZSxHZkRIQndGUl9mYWRlIDE5MDBtcyBsaW5lYXIgMG1zIGluZmluaXRlO30uR2ZESEJ3RlJfMntzdHJva2UtZGFzaGFycmF5OjUyIDU0O3N0cm9rZS1kYXNob2Zmc2V0OjUzO2FuaW1hdGlvbjpHZkRIQndGUl9kcmF3XzIgMTkwMG1zIGVhc2UgMG1zIGluZmluaXRlLEdmREhCd0ZSX2ZhZGUgMTkwMG1zIGxpbmVhciAwbXMgaW5maW5pdGU7fS5HZkRIQndGUl8ze3N0cm9rZS1kYXNoYXJyYXk6MTAyIDEwNDtzdHJva2UtZGFzaG9mZnNldDoxMDM7YW5pbWF0aW9uOkdmREhCd0ZSX2RyYXdfMyAxOTAwbXMgZWFzZSAwbXMgaW5maW5pdGUsR2ZESEJ3RlJfZmFkZSAxOTAwbXMgbGluZWFyIDBtcyBpbmZpbml0ZTt9LkdmREhCd0ZSXzR7c3Ryb2tlLWRhc2hhcnJheToxNjkgMTcxO3N0cm9rZS1kYXNob2Zmc2V0OjE3MDthbmltYXRpb246R2ZESEJ3RlJfZHJhd180IDE5MDBtcyBlYXNlIDBtcyBpbmZpbml0ZSxHZkRIQndGUl9mYWRlIDE5MDBtcyBsaW5lYXIgMG1zIGluZmluaXRlO30uR2ZESEJ3RlJfNXtzdHJva2UtZGFzaGFycmF5OjEzNiAxMzg7c3Ryb2tlLWRhc2hvZmZzZXQ6MTM3O2FuaW1hdGlvbjpHZkRIQndGUl9kcmF3XzUgMTkwMG1zIGVhc2UgMG1zIGluZmluaXRlLEdmREhCd0ZSX2ZhZGUgMTkwMG1zIGxpbmVhciAwbXMgaW5maW5pdGU7fS5HZkRIQndGUl82e3N0cm9rZS1kYXNoYXJyYXk6MSAzO3N0cm9rZS1kYXNob2Zmc2V0OjI7YW5pbWF0aW9uOkdmREhCd0ZSX2RyYXdfNiAxOTAwbXMgZWFzZSAwbXMgaW5maW5pdGUsR2ZESEJ3RlJfZmFkZSAxOTAwbXMgbGluZWFyIDBtcyBpbmZpbml0ZTt9LkdmREhCd0ZSXzd7c3Ryb2tlLWRhc2hhcnJheTozNSAzNztzdHJva2UtZGFzaG9mZnNldDozNjthbmltYXRpb246R2ZESEJ3RlJfZHJhd183IDE5MDBtcyBlYXNlIDBtcyBpbmZpbml0ZSxHZkRIQndGUl9mYWRlIDE5MDBtcyBsaW5lYXIgMG1zIGluZmluaXRlO30uR2ZESEJ3RlJfOHtzdHJva2UtZGFzaGFycmF5OjY3IDY5O3N0cm9rZS1kYXNob2Zmc2V0OjY4O2FuaW1hdGlvbjpHZkRIQndGUl9kcmF3XzggMTkwMG1zIGVhc2UgMG1zIGluZmluaXRlLEdmREhCd0ZSX2ZhZGUgMTkwMG1zIGxpbmVhciAwbXMgaW5maW5pdGU7fUBrZXlmcmFtZXMgR2ZESEJ3RlJfZHJhd3sxMDAle3N0cm9rZS1kYXNob2Zmc2V0OjA7fX1Aa2V5ZnJhbWVzIEdmREhCd0ZSX2ZhZGV7MCV7c3Ryb2tlLW9wYWNpdHk6MTt9ODkuNDczNjg0MjEwNTI2MzIle3N0cm9rZS1vcGFjaXR5OjE7fTEwMCV7c3Ryb2tlLW9wYWNpdHk6MDt9fUBrZXlmcmFtZXMgR2ZESEJ3RlJfZHJhd18wezEwLjUyNjMxNTc4OTQ3MzY4MyV7c3Ryb2tlLWRhc2hvZmZzZXQ6IDkyfTUyLjYzMTU3ODk0NzM2ODQyJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fTEwMCV7IHN0cm9rZS1kYXNob2Zmc2V0OiAwO319QGtleWZyYW1lcyBHZkRIQndGUl9kcmF3XzF7MTMuMTU3ODk0NzM2ODQyMTA0JXtzdHJva2UtZGFzaG9mZnNldDogMTE1fTU1LjI2MzE1Nzg5NDczNjg1JXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fTEwMCV7IHN0cm9rZS1kYXNob2Zmc2V0OiAwO319QGtleWZyYW1lcyBHZkRIQndGUl9kcmF3XzJ7MTUuNzg5NDczNjg0MjEwNTI2JXtzdHJva2UtZGFzaG9mZnNldDogNTN9NTcuODk0NzM2ODQyMTA1MjcleyBzdHJva2UtZGFzaG9mZnNldDogMDt9MTAwJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fX1Aa2V5ZnJhbWVzIEdmREhCd0ZSX2RyYXdfM3sxOC40MjEwNTI2MzE1Nzg5NDUle3N0cm9rZS1kYXNob2Zmc2V0OiAxMDN9NjAuNTI2MzE1Nzg5NDczNjg1JXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fTEwMCV7IHN0cm9rZS1kYXNob2Zmc2V0OiAwO319QGtleWZyYW1lcyBHZkRIQndGUl9kcmF3XzR7MjEuMDUyNjMxNTc4OTQ3MzY2JXtzdHJva2UtZGFzaG9mZnNldDogMTcwfTYzLjE1Nzg5NDczNjg0MjEleyBzdHJva2UtZGFzaG9mZnNldDogMDt9MTAwJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fX1Aa2V5ZnJhbWVzIEdmREhCd0ZSX2RyYXdfNXsyMy42ODQyMTA1MjYzMTU3ODgle3N0cm9rZS1kYXNob2Zmc2V0OiAxMzd9NjUuNzg5NDczNjg0MjEwNTMleyBzdHJva2UtZGFzaG9mZnNldDogMDt9MTAwJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fX1Aa2V5ZnJhbWVzIEdmREhCd0ZSX2RyYXdfNnsyNi4zMTU3ODk0NzM2ODQyMSV7c3Ryb2tlLWRhc2hvZmZzZXQ6IDJ9NjguNDIxMDUyNjMxNTc4OTUleyBzdHJva2UtZGFzaG9mZnNldDogMDt9MTAwJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fX1Aa2V5ZnJhbWVzIEdmREhCd0ZSX2RyYXdfN3syOC45NDczNjg0MjEwNTI2MzQle3N0cm9rZS1kYXNob2Zmc2V0OiAzNn03MS4wNTI2MzE1Nzg5NDczNyV7IHN0cm9rZS1kYXNob2Zmc2V0OiAwO30xMDAleyBzdHJva2UtZGFzaG9mZnNldDogMDt9fUBrZXlmcmFtZXMgR2ZESEJ3RlJfZHJhd184ezMxLjU3ODk0NzM2ODQyMTA1JXtzdHJva2UtZGFzaG9mZnNldDogNjh9NzMuNjg0MjEwNTI2MzE1NzgleyBzdHJva2UtZGFzaG9mZnNldDogMDt9MTAwJXsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7fX08L3N0eWxlPjwvc3ZnPgo="
                style={{height}}/>
            {
                children && <div className="pt-3">
                    {children}
                </div>
            }

        </div>
        </div>


    );
}
(function() {
  var defaultData = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDEyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgNTE0NDgpICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgWw0KCTwhRU5USVRZIG5zX3N2ZyAiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTwhRU5USVRZIG5zX3hsaW5rICJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCl0+DQo8c3ZnICB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iJm5zX3N2ZzsiIHhtbG5zOnhsaW5rPSImbnNfeGxpbms7IiB3aWR0aD0iODUwLjM5NCIgaGVpZ2h0PSI4NTAuMzk0Ig0KCSB2aWV3Qm94PSIwIDAgODUwLjM5NCA4NTAuMzk0IiBzdHlsZT0ib3ZlcmZsb3c6dmlzaWJsZTtlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDg1MC4zOTQgODUwLjM5NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IlhNTElEXzFfIj4NCgk8Zz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0VGOTQ3RDsiIGQ9Ik0xODYuMDMsMzY1Ljg5Yy00LjQsMS40My05LjIzLDIuMDItMTMuOTgsMS44N2wtNC42Ni0wLjkyYy05LjUtMS40MS0xOC4zLTUuOTYtMjIuMjEtMTQuMzYNCgkJCWwzLjI3LTAuNTFjNS41NC0xNC4zOSw5LjgyLTIwLjEyLDI1LjQ5LTE5LjkzYzEyLjAyLDAuMTQsMjMuMDEsMTEuNDYsMjMuMjQsMjMuMjVsMi4xMiwxLjQzDQoJCQlDMTk2LjEyLDM2MS4xNSwxOTEuNCwzNjQuMTQsMTg2LjAzLDM2NS44OXoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6IzIzMUYyMDsiIGQ9Ik0yMTIuNjgsMjg0Ljk4Yy0zMi4wMS00LjQtMTAuNjItMjQuOTksNy43NS0xMi43NGwtMS4yOSwyLjQzYy0yLjI2LDAtNC4yNSw0LjExLTYuMDEsMTAuNDMNCgkJCUwyMTIuNjgsMjg0Ljk4eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojMjMxRjIwOyIgZD0iTTEzMC44OSwyNzEuMTNjMTguMzctMTIuMjUsMzkuNzYsOC4zNCw3Ljc1LDEyLjc0bC00LjcyLDAuNjZjLTEuMTMtNi4xNC0yLjItMTAuOTctMy4xMi0xMy4zNw0KCQkJTDEzMC44OSwyNzEuMTN6Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiMyMzFGMjA7IiBkPSJNNjExLjMsMzc2Ljg2YzEuNjQxLDE0LjExLTIuMjYsMjQuMzYtMTQuNDcsMzEuNjNjLTExLjA0LDYuNTgtMTguNTEsMTEuNTUtMjQuMzUsMjMuMjkNCgkJCWMtNC45NzEsMTAtMTUuMTMxLDE4LjQ3OS0yNy4wNywxNy43NzljLTYuMjItMC4zNjktMTIuMTEtMy4xMTktMTguMjgtMy42OGMtNi41Ni0wLjYtOS45MiwxLjUzLTE1LjA2LDUuMjcxDQoJCQljLTkuOTYsNy4yNi0xNy4yLDExLjg0LTI5LjkyLDkuMzY5Yy0xMS4zMTEtMi4yMS0yMi43NzEtOS4xNDktMjkuNS0xOC42ODljLTQuOTcxLTcuMDUtOS4xMDEtMTUuNzcxLTkuMTUtMjQuNjMNCgkJCWMtMC4wNi0xMS4yMiw1Ljc2LTE5Ljc3LDcuMzItMzAuMzZjMS43Ny0xMi4wNi05LjM3LTIxLjkyLTE2LjktMzAuMDljLTYuNzctNy4zNC0xMi40LTE0LjUyLTE3LjQ0LTIzLjIyDQoJCQljLTUuMzEtOS4xNC03LjYxLTE4Ljc1LTQuMjEtMjkuMTljMi44NC04LjcxLDEwLjMyLTE1LjI4LDEwLjg1LTI0LjY2YzAuNTktMTAuNjEtNC4yNS0xNy44Ny0xMi0yNC40Mw0KCQkJYy02LjQ4LTUuNDktMTYuNTYtMTAuNzctMjEuNDYtMTcuOWwwLjA5LTEuMzZjNjAuMDcsMy44MywxNjAuNzIsMS4zNiwxOTYuMzgtMS45MWwwLjA2MSwwLjY2YzkuODEsOC41NCwxOC4yMiwxNS41MSwyMy45MywyOC42Mw0KCQkJYzcuMjQsMTYuNjgsMywzNy4xNy00LjEwMSw1Mi45M2MtNC4xNCw5LjIxLTYuMTcsMTcuOTItNC42OCwyOC4yQzYwMi45OSwzNTUuODIsNjA5Ljk3LDM2NS4zNyw2MTEuMywzNzYuODZ6Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiMyMzFGMjA7IiBkPSJNNzU0LjksMzI5LjA1Yy0wLjEyLDAuMzUtMC4yMywwLjctMC4zNTEsMS4wNmMtMi41NCw3Ljc2LTUuMjgsMTYuMTktOC4wNCwyNC44Mg0KCQkJYy0yLjc0LDguNTgtNS41LDE3LjM0LTguMSwyNS44M2wtMC42NS0wLjJjLTMuNjMsMy4zNS0xMS43LDExLjM5LTE2LjMxOSwxMi41MmMtMTIuMzUxLDMuMDItMjEuNDMxLTYuNC0yMy41My0xNy43Mg0KCQkJYy0xLjc5LTkuNjgsMS4wOC0yMi44Mi04LjQ5LTI4LjkyYy05LjA2LTUuNzctMjEuNjUsMi41My0zMS4zMi0yLjg1Yy05LjM1LTUuMTktMTcuMS0xOC4wMS0xOC42MTktMjcuODQNCgkJCWMtMi40LTE1LjQ0LTIuMzYtNTIuMjUsMjEuMzI5LTQ4LjYzYzUuOTQsMC45LDEwLjg1MSw1LjEsMTYuODUxLDUuNzhjNi44NywwLjc5LDguNjMtMSwxMy4wNi01LjI0DQoJCQljNS45Mi01LjY2LDE0LjY5LTMuMSwyMC4yOS05LjQ5YzAuOTcxLTcuMTgtNy45NzktMTIuMDctOS4zMS0xOC43M2MtMi4yNzEtMTEuMzcsMTcuNzctMTYuNzIsMjguNzUtMTQuMTFsMC4xMDktMC4yNw0KCQkJYzYuNCwyLjQ1LDExLjg5MSw1Ljc5LDE2LjA5MSwxMC4yYzE1LjMxOSwxNi4xLDI2LjIyOSwzNC4xMiwyMS44NCw1OC42OGMtMC41LTEuOTgtMC45NC0yLjc2LTAuOTQtMi43Ng0KCQkJUzc2Mi4wMiwzMDcuMzYsNzU0LjksMzI5LjA1eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojMjMxRjIwOyIgZD0iTTIzMi44Niw0NzAuNDZsLTEuMjQsMC43NzFjLTcuMjEtMTEuNjMxLTEzLjU3LTI1LjAxMS0xNy4wNS0zOC40DQoJCQljLTUuNTgtMjEuNDgtMjIuNjUtNTUuNTEtMjguNTQtNjYuOTRjNS4zNy0xLjc1LDEwLjA5LTQuNzQsMTMuMjctOS4xN2MxLjU0LTIuMTYsMi43Mi00LjY2LDMuNDItNy41Mg0KCQkJYzIuMTQtOC43NCw1LjI5LTQ1LjczLDEwLjQxLTY0LjFjMS43Ni02LjMyLDMuNzUtMTAuNDMsNi4wMS0xMC40M2MwLjE1LDAsMC4zMSwwLjAyLDAuNDYsMC4wNmM3LjYyLDEuODUsMTgsNi45MiwzMS44NC0yLjQ5DQoJCQljMTIuMy04LjM4LDIxLjgxLTE5Ljk3LDIyLjg1LTMwLjg2bDEuOTYsMC4xNWMwLDAsOS4yMi0zLjU1LDI3LjA2LTYuMDZjLTAuMTUsNC4zMywyLjM5LDUuNDcsNS40Nyw4LjU1DQoJCQljMy40NiwzLjQ2LDYuMTQsNy44OCw4LjY1LDEyLjAzYzUuNDksOS4wNSw2LjM4LDE5LjI4LDUuODYsMjkuNzZjLTAuNjIsMTIuMzEtMiwyMC44Nyw0LjMxLDMyLjAzDQoJCQljNS41NSw5LjgyLDEyLjgyLDE3LjYxLDE2Ljg0LDI4LjQ2YzQuMTUsMTEuMiwzLjQ5LDIwLjE3LTEuNywzMC42MmMtNC45NSw5Ljk2LTE0LjI2LDE5LjM3LTE1LjI3LDMwLjMNCgkJCWMtMC45NSwxMC4xOSwwLjc4LDE5LjkxLTQuODQsMjguNmMtNS45Myw5LjE4LTE4LjQxLDkuNTY5LTI4LjYxLDhjLTEzLjU3LTIuMTAxLTMxLjM3LTguMjMtNDQuNC0xLjYxDQoJCQljLTYuMTYsMy4xMi0xMC40Nyw2LjYxLTEyLjA4LDEzLjA3QzIzNi4yNyw0NjAuNCwyMzguMDcsNDY3LjQsMjMyLjg2LDQ3MC40NnoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0yMjUuODcsMjM4LjUxYzMuMTYtMC4xNSw4LjkzLTUuMDQsMjAuNTktMTMuMzNjNy4zNS01LjIyLDI0LjUzLDAuMzEsMjcuMTMsOC44NQ0KCQkJYzAuNzIsMi4zOCwwLjkzLDQuODQsMC43LDcuMzVjLTEuMDQsMTAuODktMTAuNTUsMjIuNDgtMjIuODUsMzAuODZjLTEzLjg0LDkuNDEtMjQuMjIsNC4zNC0zMS44NCwyLjQ5DQoJCQljLTAuMTUtMC4wNC0wLjMxLTAuMDYtMC40Ni0wLjA2bDEuMjktMi40M2MtMTguMzctMTIuMjUtMzkuNzYsOC4zNC03Ljc1LDEyLjc0bDAuNDUsMC4xMmMtNS4xMiwxOC4zNy04LjI3LDU1LjM2LTEwLjQxLDY0LjENCgkJCWMtMC43LDIuODYtMS44OCw1LjM2LTMuNDIsNy41MmwtMi4xMi0xLjQzYy0wLjIzLTExLjc5LTExLjIyLTIzLjExLTIzLjI0LTIzLjI1Yy0xNS42Ny0wLjE5LTE5Ljk1LDUuNTQtMjUuNDksMTkuOTNsLTMuMjcsMC41MQ0KCQkJYy0wLjcyLTEuNTUtMS4yOC0zLjI0LTEuNjQtNS4wNmMtMS42MS04LjEyLTUuOS00Mi42MS05LjYyLTYyLjg5bDQuNzItMC42NmMzMi4wMS00LjQsMTAuNjItMjQuOTktNy43NS0xMi43NGwtMC4wOSwwLjAzDQoJCQljLTAuNDMtMS4wNy0wLjgxLTEuNjYtMS4xNi0xLjY2bDEuMDktMy4zNWMwLDAtNC43OC0xNi4wNi0yLjUzLTMyLjM0YzAuNzMtMS41MiwxLjI5LTMuOTEsMS45LTcuMjcNCgkJCWMwLjMxLTEuNzEsMC43NS0zLjMxLDEuMzEtNC44MWM3LjI3LTE5LjY1LDMzLjc4LTIxLjM3LDM1LjM0LTIxLjgybDE5LjM2LDAuOWMxLjY2LDAuNTYsMzIuMTEsMy44OCwzNS40MywyOC4yNA0KCQkJQzIyMi40NSwyMzUuNzIsMjIzLjMyLDIzOC42NSwyMjUuODcsMjM4LjUxeiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTEzMC43MywyNjYuMTVsLTEuMDksMy4zNWMtMC4xMywwLTAuMjUsMC4wOC0wLjM3LDAuMjRjLTMuNTQsNC44My0xNy41Niw4LjY0LTMwLjk3LTEuMzgNCgkJCWMtMTQuNjYtMTAuOTYtMjQuODYtMjYuNjEtMjAuNDItMzkuMTZjMi45Ny04LjQyLDIwLjM5LTEzLjE4LDI3LjUtNy42NGMxNS43NiwxMi4yOSwyMC4zMSwxNy40NSwyMi44MiwxMi4yNQ0KCQkJQzEyNS45NSwyNTAuMDksMTMwLjczLDI2Ni4xNSwxMzAuNzMsMjY2LjE1eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRjZDQzRCOyIgZD0iTTI3NC42OCw2NjIuOGwtMzAuMjYtMC4yMjljMC4xOS03LjA3LDAuNzItMTUuMTUsMS40NS0yMy44NmwwLjU4LDAuMDVoMjcuNTYNCgkJCUMyNzQuMTksNjUyLjM5LDI3NC42OCw2NjIuOCwyNzQuNjgsNjYyLjh6Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGNkNDNEI7IiBkPSJNMzI2Ljk0LDY0Mi45NGgwLjEzYy0wLjI4LDE0LjQyLTAuMTMsMjQuMDQtMC4xMywyNC4wNGgtMzEuMzZjLTAuMTItNS40NSwwLjM1LTE0LDEuMDYtMjQuMTINCgkJCWwxLjA0LDAuMDhIMzI2Ljk0eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRjZDQzRCOyIgZD0iTTYzMS4xNCw2MzcuNzFoMjYuMDdjLTAuOTksNS45NC0yLjEzLDEzLjc0LTMuNiwyNC41N2wtMjcuMTgxLTAuNTIxDQoJCQljMC45OS04LjYwOSwyLjUtMTYuNjQ5LDQuMzExLTI0LjE0OUw2MzEuMTQsNjM3LjcxeiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRjZDQzRCOyIgZD0iTTY4OS41Niw2NDguMTZoMjQuMTcxYy0xLjE4MSwxMy41OC0xLjA2MSwyMS45Ni0xLjA2MSwyMS45NmgtMjUuNjENCgkJCUM2ODcuNDEsNjY0LjcsNjg4LjM1LDY1Ni45OCw2ODkuNTYsNjQ4LjE2eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTc2OC40OSwyOTMuOTRjMS40Nyw1Ljc4LDMuNDUsMjEuNzktMy41NSw1OC40Yy05LjQxLDQ5LjEzLTcuMzIsNTkuNTgtNy4zMiw4Ni43Ng0KCQkJYzAsMjcuMTgxLDExLjUsNTcuNDksOC4zNiw2NC44MTFjLTMuMTMxLDcuMzItMTkuODUxLDE0LjYzLTIwLjktMTUuNjhjLTEuMDUtMzAuMzExLTMuMTQtNzkuNDQtMy4xNC03OS40NGwxMi45Ni03OS43NA0KCQkJYzcuMTE5LTIxLjY5LDEyLjY0OS0zNy44NywxMi42NDktMzcuODdTNzY3Ljk5LDI5MS45Niw3NjguNDksMjkzLjk0eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRUY5NDdEOyIgZD0iTTY2Ni4xOCw0NzguOTJsLTIuNjQsMC45NWMtMy44MSw4LjMyLTEyLjMxLDE0LjEzLTIxLjU5LDE3LjE0OQ0KCQkJYy02LjI1LDIuMDIxLTEyLjg1MSwyLjc5LTE4LjYyLDIuMTljLTE4LjQxLTEuOTEtMzIuODItMTIuNzgtNDQuMzMtMjYuNTFjOS4zOS03LjEyLDE3Ljg3LTE1LjkzMSwyNi4xMi0yNC4xODENCgkJCWM1LjE4LTUuMTg5LDE1LjYtMTYuNzc5LDIzLjgyLTE1LjA2OWM3Ljc1LDEuNjA5LDE1LjU2LDExLjQ3LDIwLjA3OSwxNy41M0M2NTUuNjksNDU5LjkxLDY2MS4yLDQ2OS4yNyw2NjYuMTgsNDc4LjkyeiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTI5MS4xMiw1MjkuNGMxLjUxLDE3LjI5LTguMTksMzIuMTU5LTEzLjczLDUyLjU2OWMtMy4yNSwxMS45Ni0zLjYyLDM3LjU4LTMuMzgsNTYuNzloLTI3LjU2DQoJCQlsLTAuNTgtMC4wNWMzLjk3LTQ3LjIsMTMuOTEtMTEzLjA5LDguMTktMTM5LjI4YzEzLjYsMTIuNzMsMzYuMzEsMjkuMzcsMzcuMDQsMjkuOTFDMjkxLjExLDUyOS4zNiwyOTEuMTEsNTI5LjM4LDI5MS4xMiw1MjkuNHoiDQoJCQkvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTY2Ni4xOCw0NzguOTJjNC45OCw5LjY1LDkuNDIsMTkuNTksMTMuOTQsMjkuNjljMS44NCw0LjEyLDMuNiw4LjM0LDUuMjYsMTIuNjQNCgkJCWMtMC45NywxNy43OC0xLjQ1LDE5LjM2LTEuNDUsMzUuNDVjMCwxNy4zOC0xMC45NzksMzEuMzU5LTE4LjMsNTEuMjJjLTQuMTgsMTEuMzUtNS43NywxMy44OC04LjQyLDI5Ljc5aC0yNi4wN2wtMC4zOTktMC4xDQoJCQljNy43Ni0zMi4xMDEsMjAuOTc5LTU0LjA5MSwyMS44My02Ni44MDFjMS4wNC0xNS42OC01Ljc1LTcyLjY0OS01Ljc1LTcyLjY0OWwtNC44Ny0xLjE0MWM5LjI4LTMuMDIsMTcuNzgtOC44MjksMjEuNTktMTcuMTQ5DQoJCQlMNjY2LjE4LDQ3OC45MnoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMzkuODUsNDk2LjE4Yy0wLjMxLDE3LjMyLTIuMDMsMzkuOTktNS44NCw2MS40Yy00Ljk1LDI3Ljc2LTYuNDksNjIuNTYtNi45NCw4NS4zNmgtMC4xM2gtMjkuMjYNCgkJCWwtMS4wNC0wLjA4YzIuNDQtMzQuNTgsNy43NC04Ny40MzEsMi4wOC05Ny4xNDFjLTIuNjQtNC41Mi01LjE2LTEwLjEyLTcuNi0xNi4zMTljMC0wLjAyMSwwLTAuMDMsMC0wLjA1MWMwLDAtMC4wMSwwLTAuMDItMC4wMQ0KCQkJYy0wLjczLTAuNTQtMjMuNDQtMTcuMTgtMzcuMDQtMjkuOTFjLTAuNDYtMC40My0wLjkxLTAuODUtMS4zNC0xLjI3Yy02LjYzLTYuMzgtMTQuMjYtMTUuODYtMjEuMS0yNi45M2wxLjI0LTAuNzcxDQoJCQljNS4yMS0zLjA2LDMuNDEtMTAuMDYsNC42OC0xNS4xOGMxLjYxLTYuNDYsNS45Mi05Ljk1LDEyLjA4LTEzLjA3YzEzLjAzLTYuNjIsMzAuODMtMC40OSw0NC40LDEuNjENCgkJCWMxMC4yLDEuNTY5LDIyLjY4LDEuMTgsMjguNjEtOGM1LjYyLTguNjksMy44OS0xOC40MSw0Ljg0LTI4LjZjMS4wMS0xMC45MywxMC4zMi0yMC4zNCwxNS4yNy0zMC4zDQoJCQljNS4xOS0xMC40NSw1Ljg1LTE5LjQyLDEuNy0zMC42MmMtNC4wMi0xMC44NS0xMS4yOS0xOC42NC0xNi44NC0yOC40NmMtNi4zMS0xMS4xNi00LjkzLTE5LjcyLTQuMzEtMzIuMDMNCgkJCWMwLjUyLTEwLjQ4LTAuMzctMjAuNzEtNS44Ni0yOS43NmMtMi41MS00LjE1LTUuMTktOC41Ny04LjY1LTEyLjAzYy0zLjA4LTMuMDgtNS42Mi00LjIyLTUuNDctOC41NQ0KCQkJYzE2LjQxLTIuMzEsNDAuMTItMy43NCw3MC42Ny0wLjczYzQuODQsMC40OCwxMC4xMywwLjg5LDE1Ljc3LDEuMjVsLTAuMDksMS4zNmM0LjksNy4xMywxNC45OCwxMi40MSwyMS40NiwxNy45DQoJCQljNy43NSw2LjU2LDEyLjU5LDEzLjgyLDEyLDI0LjQzYy0wLjUzLDkuMzgtOC4wMSwxNS45NS0xMC44NSwyNC42NmMtMy40LDEwLjQ0LTEuMSwyMC4wNSw0LjIxLDI5LjE5DQoJCQljNS4wNCw4LjcsMTAuNjcsMTUuODgsMTcuNDQsMjMuMjJjNy41Myw4LjE3LDE4LjY3LDE4LjAzLDE2LjksMzAuMDljLTEuNTYxLDEwLjU5LTcuMzgsMTkuMTQtNy4zMiwzMC4zNg0KCQkJYzAuMDUsOC44NTksNC4xOCwxNy41OCw5LjE1LDI0LjYzYzYuNzI5LDkuNTQsMTguMTg5LDE2LjQ3OSwyOS41LDE4LjY4OWMxMi43MiwyLjQ3MSwxOS45Ni0yLjEwOSwyOS45Mi05LjM2OQ0KCQkJYzUuMTQtMy43NCw4LjUtNS44NywxNS4wNi01LjI3MWM2LjE3LDAuNTYxLDEyLjA2MSwzLjMxMSwxOC4yOCwzLjY4YzExLjkzOSwwLjcsMjIuMS03Ljc3OSwyNy4wNy0xNy43NzkNCgkJCWM1Ljg0LTExLjc0LDEzLjMxLTE2LjcxLDI0LjM1LTIzLjI5YzEyLjIxLTcuMjcsMTYuMTEtMTcuNTIsMTQuNDctMzEuNjNjLTEuMzMtMTEuNDktOC4zMS0yMS4wNC05Ljk2LTMyLjM2DQoJCQljLTEuNDktMTAuMjgsMC41NC0xOC45OSw0LjY4LTI4LjJjNy4xMDEtMTUuNzYsMTEuMzQxLTM2LjI1LDQuMTAxLTUyLjkzYy01LjcxLTEzLjEyLTE0LjEyLTIwLjA5LTIzLjkzLTI4LjYzbC0wLjA2MS0wLjY2DQoJCQljNS4xMy0wLjQ3LDguOTEtMC45NSwxMS4wNC0xLjQ0YzE1LjgtMy42MSw5Mi44Mi0yMy4yLDEzMy4zOS03LjU5djAuMDFsLTAuMTA5LDAuMjdjLTEwLjk4LTIuNjEtMzEuMDIxLDIuNzQtMjguNzUsMTQuMTENCgkJCWMxLjMzLDYuNjYsMTAuMjgsMTEuNTUsOS4zMSwxOC43M2MtNS42LDYuMzktMTQuMzcsMy44My0yMC4yOSw5LjQ5Yy00LjQzLDQuMjQtNi4xODksNi4wMy0xMy4wNiw1LjI0DQoJCQljLTYtMC42OC0xMC45MS00Ljg4LTE2Ljg1MS01Ljc4Yy0yMy42ODktMy42Mi0yMy43MjksMzMuMTktMjEuMzI5LDQ4LjYzYzEuNTIsOS44Myw5LjI3LDIyLjY1LDE4LjYxOSwyNy44NA0KCQkJYzkuNjcsNS4zOCwyMi4yNjEtMi45MiwzMS4zMiwyLjg1YzkuNTcsNi4xLDYuNywxOS4yNCw4LjQ5LDI4LjkyYzIuMSwxMS4zMiwxMS4xOCwyMC43NCwyMy41MywxNy43Mg0KCQkJYzQuNjE5LTEuMTMsMTIuNjg5LTkuMTcsMTYuMzE5LTEyLjUybDAuNjUsMC4yYy02LjI3MSwyMC40NC0xMS42NSwzOS4yNy0xMy43MSw0OS45NzFjLTYuMjgsMzIuNDA5LDEyLjAxLDYwLjY0LDEyLjAxLDc2LjMxDQoJCQljMCwxNS42OC00LjA3LDUwLjIyLTEyLjU0LDgxLjU0Yy02LjMsMjMuMzEtOS4xNiw0NC42LTEwLjQzOSw1OS41OEg2ODkuNTZjNC4xODEtMzAuMzIsMTEuNjUtNzMuNTgsMTAuMDgtODAuNDYNCgkJCWMtMy40MzktMTQuOTQtOC4yNzktMzEuMTItMTQuMjYtNDYuNDVjLTEuNjYtNC4zLTMuNDItOC41Mi01LjI2LTEyLjY0Yy00LjUyMS0xMC4xMDEtOC45Ni0yMC4wNC0xMy45NC0yOS42OQ0KCQkJYy00Ljk3OS05LjY1LTEwLjQ4OS0xOS4wMS0xNy4xNi0yNy45MzljLTQuNTItNi4wNjEtMTIuMzI5LTE1LjkyMS0yMC4wNzktMTcuNTNjLTguMjIxLTEuNzEtMTguNjQxLDkuODgtMjMuODIsMTUuMDY5DQoJCQljLTguMjUsOC4yNS0xNi43MywxNy4wNjEtMjYuMTIsMjQuMTgxYy05LjIyLDctMTkuMzMsMTIuMzUtMzAuOTcsMTMuOTZjLTI3Ljk0LDMuODUtNTUuNzcxLTAuOTctODMuMTktNC41NjENCgkJCWMtMTQuNDctMS44OTktMjguOTctMy43MS00My4xNS02LjQzOWMtMTEuNTEtMi4yMi0yNC4wMy00LjI5LTM1LjI3LTEuMDFjLTEwLjI4LDMuMDEtMjAuNjUsNy44OC0yOS44LDEzLjU0DQoJCQljLTQuOTgsMy4wNzktOS43MSw1Ljc3OS0xNS4yOCw4LjAyTDMzOS44NSw0OTYuMTh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDo3OyIgZD0iTTIxMi42OCwyODQuOThjLTMyLjAxLTQuNC0xMC42Mi0yNC45OSw3Ljc1LTEyLjc0Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjc7IiBkPSJNMTM4LjY0LDI4My44N2MzMi4wMS00LjQsMTAuNjItMjQuOTktNy43NS0xMi43NCIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik0yMjUuODcsMjM4LjUxYy0yLjU1LDAuMTQtMy40Mi0yLjc5LTQuMzMtOS40Ng0KCQkJYy0zLjMyLTI0LjM2LTMzLjc3LTI3LjY4LTM1LjQzLTI4LjI0bC0xOS4zNi0wLjljLTEuNTYsMC40NS0yOC4wNywyLjE3LTM1LjM0LDIxLjgyYy0wLjU2LDEuNS0xLDMuMS0xLjMxLDQuODENCgkJCWMtMC42MSwzLjM2LTEuMTcsNS43NS0xLjksNy4yN2MtMi41MSw1LjItNy4wNiwwLjA0LTIyLjgyLTEyLjI1Yy03LjExLTUuNTQtMjQuNTMtMC43OC0yNy41LDcuNjQNCgkJCWMtNC40NCwxMi41NSw1Ljc2LDI4LjIsMjAuNDIsMzkuMTZjMTMuNDEsMTAuMDIsMjcuNDMsNi4yMSwzMC45NywxLjM4YzAuMTItMC4xNiwwLjI0LTAuMjQsMC4zNy0wLjI0YzAuMzUsMCwwLjczLDAuNTksMS4xNiwxLjY2DQoJCQljMC45MiwyLjQsMS45OSw3LjIzLDMuMTIsMTMuMzdjMy43MiwyMC4yOCw4LjAxLDU0Ljc3LDkuNjIsNjIuODljMC4zNiwxLjgyLDAuOTIsMy41MSwxLjY0LDUuMDYNCgkJCWMzLjkxLDguNCwxMi43MSwxMi45NSwyMi4yMSwxNC4zNmw0LjY2LDAuOTJjNC43NSwwLjE1LDkuNTgtMC40NCwxMy45OC0xLjg3YzUuMzctMS43NSwxMC4wOS00Ljc0LDEzLjI3LTkuMTcNCgkJCWMxLjU0LTIuMTYsMi43Mi00LjY2LDMuNDItNy41MmMyLjE0LTguNzQsNS4yOS00NS43MywxMC40MS02NC4xYzEuNzYtNi4zMiwzLjc1LTEwLjQzLDYuMDEtMTAuNDNjMC4xNSwwLDAuMzEsMC4wMiwwLjQ2LDAuMDYNCgkJCWM3LjYyLDEuODUsMTgsNi45MiwzMS44NC0yLjQ5YzEyLjMtOC4zOCwyMS44MS0xOS45NywyMi44NS0zMC44NmMwLjIzLTIuNTEsMC4wMi00Ljk3LTAuNy03LjM1Yy0yLjYtOC41NC0xOS43OC0xNC4wNy0yNy4xMy04Ljg1DQoJCQlDMjM0LjgsMjMzLjQ3LDIyOS4wMywyMzguMzYsMjI1Ljg3LDIzOC41MXoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBkPSJNMTQ4LjQ1LDM1MS45N2M1LjU0LTE0LjM5LDkuODItMjAuMTIsMjUuNDktMTkuOTMNCgkJCWMxMi4wMiwwLjE0LDIzLjAxLDExLjQ2LDIzLjI0LDIzLjI1Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgZD0iTTEzMC43MywyNjYuMTVjMCwwLTQuNzgtMTYuMDYtMi41My0zMi4zNA0KCQkJYzAuNTYtNC4wOSwxLjU3LTguMjEsMy4yMS0xMi4wOGMwLjE0LTAuMzMsMC4yOC0wLjY2LDAuNDMtMC45OCIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik0yNzYuMjUsMjQxLjUzYzAsMCw5LjIyLTMuNTUsMjcuMDYtNi4wNg0KCQkJYzE2LjQxLTIuMzEsNDAuMTItMy43NCw3MC42Ny0wLjczYzQuODQsMC40OCwxMC4xMywwLjg5LDE1Ljc3LDEuMjVjNjAuMDcsMy44MywxNjAuNzIsMS4zNiwxOTYuMzgtMS45MQ0KCQkJYzUuMTMtMC40Nyw4LjkxLTAuOTUsMTEuMDQtMS40NGMxNS44LTMuNjEsOTIuODItMjMuMiwxMzMuMzktNy41OXYwLjAxYzYuNCwyLjQ1LDExLjg5MSw1Ljc5LDE2LjA5MSwxMC4yDQoJCQljMTUuMzE5LDE2LjEsMjYuMjI5LDM0LjEyLDIxLjg0LDU4LjY4Yy0wLjI5LDEuNjYtMC42NiwzLjM2LTEuMTAxLDUuMDkiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBkPSJNMTg0LDM2MmMwLDAsMC43NSwxLjQyLDIuMDMsMy44OWM1Ljg5LDExLjQzLDIyLjk2LDQ1LjQ2LDI4LjU0LDY2Ljk0DQoJCQljMy40OCwxMy4zOSw5Ljg0LDI2Ljc3LDE3LjA1LDM4LjRjNi44NCwxMS4wNjksMTQuNDcsMjAuNTUsMjEuMSwyNi45M2MwLjQzLDAuNDIsMC44OCwwLjg0LDEuMzQsMS4yNw0KCQkJYzEzLjYsMTIuNzMsMzYuMzEsMjkuMzcsMzcuMDQsMjkuOTFjMC4wMSwwLjAxLDAuMDIsMC4wMSwwLjAyLDAuMDEiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBkPSJNMzQxLjM0LDQ5Ni4yMWM1LjU3LTIuMjQsMTAuMy00Ljk0LDE1LjI4LTguMDINCgkJCWM5LjE1LTUuNjYsMTkuNTItMTAuNTMsMjkuOC0xMy41NGMxMS4yNC0zLjI4LDIzLjc2LTEuMjEsMzUuMjcsMS4wMWMxNC4xOCwyLjcyOSwyOC42OCw0LjU0LDQzLjE1LDYuNDM5DQoJCQljMjcuNDIsMy41OTEsNTUuMjUsOC40MSw4My4xOSw0LjU2MWMxMS42NC0xLjYxLDIxLjc1LTYuOTYsMzAuOTctMTMuOTZjOS4zOS03LjEyLDE3Ljg3LTE1LjkzMSwyNi4xMi0yNC4xODENCgkJCWM1LjE4LTUuMTg5LDE1LjYtMTYuNzc5LDIzLjgyLTE1LjA2OWM3Ljc1LDEuNjA5LDE1LjU2LDExLjQ3LDIwLjA3OSwxNy41M2M2LjY3MSw4LjkzLDEyLjE4MSwxOC4yODksMTcuMTYsMjcuOTM5DQoJCQljNC45OCw5LjY1LDkuNDIsMTkuNTksMTMuOTQsMjkuNjljMS44NCw0LjEyLDMuNiw4LjM0LDUuMjYsMTIuNjRjNS45OCwxNS4zMywxMC44MiwzMS41MSwxNC4yNiw0Ni40NQ0KCQkJYzEuNTcsNi44OC01Ljg5OSw1MC4xNC0xMC4wOCw4MC40NmMtMS4yMSw4LjgyLTIuMTQ5LDE2LjU0LTIuNSwyMS45NmgyNS42MWMwLDAtMC4xMi04LjM4LDEuMDYxLTIxLjk2DQoJCQljMS4yNzktMTQuOTgsNC4xNC0zNi4yNzEsMTAuNDM5LTU5LjU4YzguNDctMzEuMzIsMTIuNTQtNjUuODYsMTIuNTQtODEuNTRjMC0xNS42Ny0xOC4yOS00My45LTEyLjAxLTc2LjMxDQoJCQljMi4wNi0xMC43MDEsNy40MzktMjkuNTMsMTMuNzEtNDkuOTcxYzIuNi04LjQ5LDUuMzU5LTE3LjI1LDguMS0yNS44M2MyLjc2LTguNjMsNS41LTE3LjA2LDguMDQtMjQuODINCgkJCWMwLjEyLTAuMzYsMC4yMy0wLjcxLDAuMzUxLTEuMDZjNy4xMTktMjEuNjksMTIuNjQ5LTM3Ljg3LDEyLjY0OS0zNy44N3MwLjQ0LDAuNzgsMC45NCwyLjc2YzEuNDcsNS43OCwzLjQ1LDIxLjc5LTMuNTUsNTguNA0KCQkJYy05LjQxLDQ5LjEzLTcuMzIsNTkuNTgtNy4zMiw4Ni43NmMwLDI3LjE4MSwxMS41LDU3LjQ5LDguMzYsNjQuODExYy0zLjEzMSw3LjMyLTE5Ljg1MSwxNC42My0yMC45LTE1LjY4DQoJCQljLTEuMDUtMzAuMzExLTMuMTQtNzkuNDQtMy4xNC03OS40NGwxMi45Ni03OS43NGwwLjYzLTMuODkiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBkPSJNNTc4Ljg3LDQ3Mi41NWMwLjA0LDAuMDUsMC4wOCwwLjEwMSwwLjEzLDAuMTUNCgkJCWMxMS41MSwxMy43MjksMjUuOTIsMjQuNiw0NC4zMywyNi41MWM1Ljc3LDAuNiwxMi4zNy0wLjE3LDE4LjYyLTIuMTljOS4yOC0zLjAyLDE3Ljc4LTguODI5LDIxLjU5LTE3LjE0OSIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik03MzAuNDUsMjI1LjMzYy0xMC45OC0yLjYxLTMxLjAyMSwyLjc0LTI4Ljc1LDE0LjExDQoJCQljMS4zMyw2LjY2LDEwLjI4LDExLjU1LDkuMzEsMTguNzNjLTUuNiw2LjM5LTE0LjM3LDMuODMtMjAuMjksOS40OWMtNC40Myw0LjI0LTYuMTg5LDYuMDMtMTMuMDYsNS4yNA0KCQkJYy02LTAuNjgtMTAuOTEtNC44OC0xNi44NTEtNS43OGMtMjMuNjg5LTMuNjItMjMuNzI5LDMzLjE5LTIxLjMyOSw0OC42M2MxLjUyLDkuODMsOS4yNywyMi42NSwxOC42MTksMjcuODQNCgkJCWM5LjY3LDUuMzgsMjIuMjYxLTIuOTIsMzEuMzIsMi44NWM5LjU3LDYuMSw2LjcsMTkuMjQsOC40OSwyOC45MmMyLjEsMTEuMzIsMTEuMTgsMjAuNzQsMjMuNTMsMTcuNzINCgkJCWM0LjYxOS0xLjEzLDEyLjY4OS05LjE3LDE2LjMxOS0xMi41MiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik02NDYuODIsNDk4LjE2YzAsMCw2Ljc5LDU2Ljk3LDUuNzUsNzIuNjQ5DQoJCQljLTAuODUxLDEyLjcxLTE0LjA3LDM0LjctMjEuODMsNjYuODAxYy0xLjgxMSw3LjUtMy4zMiwxNS41NC00LjMxMSwyNC4xNDlsMjcuMTgxLDAuNTIxYzEuNDctMTAuODMsMi42MDktMTguNjMsMy42LTI0LjU3DQoJCQljMi42NS0xNS45MSw0LjI0LTE4LjQ0LDguNDItMjkuNzljNy4zMi0xOS44NiwxOC4zLTMzLjg0LDE4LjMtNTEuMjJjMC0xNi4wOSwwLjQ4LTE3LjY3LDEuNDUtMzUuNDVjMC4wNC0wLjcsMC4wOC0xLjQzLDAuMTItMi4xOA0KCQkJIi8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgZD0iTTI2Ni4zMiw0NjEuMDVjNy44OSwxNC4xNiwxNS43NCw0NS4yOSwyNC43OCw2OC4yOQ0KCQkJYzAuMDEsMC4wMjEsMC4wMSwwLjA0LDAuMDIsMC4wNjFjMi40NCw2LjE5OSw0Ljk2LDExLjgsNy42LDE2LjMxOWM1LjY2LDkuNzEsMC4zNiw2Mi41NjEtMi4wOCw5Ny4xNDENCgkJCWMtMC43MSwxMC4xMi0xLjE4LDE4LjY3LTEuMDYsMjQuMTJoMzEuMzZjMCwwLTAuMTUtOS42MiwwLjEzLTI0LjA0YzAuNDUtMjIuODAxLDEuOTktNTcuNjAxLDYuOTQtODUuMzYNCgkJCWMzLjgxLTIxLjQxLDUuNTMtNDQuMDgsNS44NC02MS40YzAuMTUtOC41MjktMC4wNC0xNS43Ny0wLjQ5LTIwLjkyIi8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgZD0iTTI1My44OSw0OTguNjZjMC4wNiwwLjI1LDAuMTIsMC41MSwwLjE3LDAuNzcNCgkJCWM1LjcyLDI2LjE5LTQuMjIsOTIuMDgtOC4xOSwxMzkuMjhjLTAuNzMsOC43MS0xLjI2LDE2Ljc5LTEuNDUsMjMuODZsMzAuMjYsMC4yMjljMCwwLTAuNDktMTAuNDEtMC42Ny0yNC4wNA0KCQkJYy0wLjI0LTE5LjIxLDAuMTMtNDQuODMsMy4zOC01Ni43OWM1LjU0LTIwLjQxLDE1LjI0LTM1LjI3OSwxMy43My01Mi41NjljMC0wLjAyMSwwLTAuMDMsMC0wLjA1MSIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik0zODkuNjYsMjM3LjM1YzQuOSw3LjEzLDE0Ljk4LDEyLjQxLDIxLjQ2LDE3LjkNCgkJCWM3Ljc1LDYuNTYsMTIuNTksMTMuODIsMTIsMjQuNDNjLTAuNTMsOS4zOC04LjAxLDE1Ljk1LTEwLjg1LDI0LjY2Yy0zLjQsMTAuNDQtMS4xLDIwLjA1LDQuMjEsMjkuMTkNCgkJCWM1LjA0LDguNywxMC42NywxNS44OCwxNy40NCwyMy4yMmM3LjUzLDguMTcsMTguNjcsMTguMDMsMTYuOSwzMC4wOWMtMS41NjEsMTAuNTktNy4zOCwxOS4xNC03LjMyLDMwLjM2DQoJCQljMC4wNSw4Ljg1OSw0LjE4LDE3LjU4LDkuMTUsMjQuNjNjNi43MjksOS41NCwxOC4xODksMTYuNDc5LDI5LjUsMTguNjg5YzEyLjcyLDIuNDcxLDE5Ljk2LTIuMTA5LDI5LjkyLTkuMzY5DQoJCQljNS4xNC0zLjc0LDguNS01Ljg3LDE1LjA2LTUuMjcxYzYuMTcsMC41NjEsMTIuMDYxLDMuMzExLDE4LjI4LDMuNjhjMTEuOTM5LDAuNywyMi4xLTcuNzc5LDI3LjA3LTE3Ljc3OQ0KCQkJYzUuODQtMTEuNzQsMTMuMzEtMTYuNzEsMjQuMzUtMjMuMjljMTIuMjEtNy4yNywxNi4xMS0xNy41MiwxNC40Ny0zMS42M2MtMS4zMy0xMS40OS04LjMxLTIxLjA0LTkuOTYtMzIuMzYNCgkJCWMtMS40OS0xMC4yOCwwLjU0LTE4Ljk5LDQuNjgtMjguMmM3LjEwMS0xNS43NiwxMS4zNDEtMzYuMjUsNC4xMDEtNTIuOTNjLTUuNzEtMTMuMTItMTQuMTItMjAuMDktMjMuOTMtMjguNjMiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBkPSJNMzAzLjQyLDIzNC4yMWMtMC4wNiwwLjQ1LTAuMSwwLjg3LTAuMTEsMS4yNg0KCQkJYy0wLjE1LDQuMzMsMi4zOSw1LjQ3LDUuNDcsOC41NWMzLjQ2LDMuNDYsNi4xNCw3Ljg4LDguNjUsMTIuMDNjNS40OSw5LjA1LDYuMzgsMTkuMjgsNS44NiwyOS43NmMtMC42MiwxMi4zMS0yLDIwLjg3LDQuMzEsMzIuMDMNCgkJCWM1LjU1LDkuODIsMTIuODIsMTcuNjEsMTYuODQsMjguNDZjNC4xNSwxMS4yLDMuNDksMjAuMTctMS43LDMwLjYyYy00Ljk1LDkuOTYtMTQuMjYsMTkuMzctMTUuMjcsMzAuMw0KCQkJYy0wLjk1LDEwLjE5LDAuNzgsMTkuOTEtNC44NCwyOC42Yy01LjkzLDkuMTgtMTguNDEsOS41NjktMjguNjEsOGMtMTMuNTctMi4xMDEtMzEuMzctOC4yMy00NC40LTEuNjENCgkJCWMtNi4xNiwzLjEyLTEwLjQ3LDYuNjEtMTIuMDgsMTMuMDdjLTEuMjcsNS4xMiwwLjUzLDEyLjEyLTQuNjgsMTUuMTgiLz4NCgkJPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgcG9pbnRzPSIyNDYuNDUsNjM4Ljc2IDI3NC4wMSw2MzguNzYgMjc1LjcyLDYzOC43NiAJCSIvPg0KCQk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIHgxPSIyOTcuNjgiIHkxPSI2NDIuOTQiIHgyPSIzMjYuOTQiIHkyPSI2NDIuOTQiLz4NCgkJPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgcG9pbnRzPSI2MzEuMTQsNjM3LjcxIDY1Ny4yMSw2MzcuNzEgNjYwLjQxLDYzNy43MSAJCSIvPg0KCQk8cG9seWxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiBwb2ludHM9IjY4Ny41OSw2NDguMTYgNjg5LjU2LDY0OC4xNiA3MTMuNzMsNjQ4LjE2IDcxNi44Niw2NDguMTYgCQkNCgkJCSIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik0yMDguMjUsMjQ0YzAsMCw4LjkyLDAsMTcuNjItNS40OWMxLjkyLTEuMiwzLjgzLTIuNjcsNS42My00LjQ4Ii8+DQoJPC9nPg0KPC9nPg0KPHJlY3Qgc3R5bGU9ImZpbGw6bm9uZTsiIHdpZHRoPSI4NTAuMzk0IiBoZWlnaHQ9Ijg1MC4zOTQiLz4NCjwvc3ZnPg0K";
  var state={}, context, canvas, img;
  var result={};
  function imageReceived(src) {
    img = new Image();
    img.onload = function() {
      var $canvas = $("#canvas");
      canvas = $canvas[0];
      context = canvas.getContext('2d');
      state = {
        zoom: 1,
        scaleX: 1,
        scaleY: 1,
        posX: 0,
        posY: 0,
        rotation: 0,
        color: null,
        mode: 'drag'
      };
      if(img.width > img.height) {
        state.scaleY = img.height / img.width;
        state.posY = (canvas.height / 2) * (1 - state.scaleY);
      } else if(img.height > img.width) {
        state.scaleX = img.width / img.height;
        state.posX = (canvas.width / 2) * (1 - state.scaleX);
      }
      state.baseScaleX = state.scaleX;
      state.baseScaleY = state.scaleY;
      state.basePosX = state.posX;
      state.basePosY = state.posY;
      var $img = $("#pic");
      result.width = $img.width();
      result.height = $img.height();
      $canvas.css('height', result.height);
      $canvas.css('width', result.width);
      result.factorX = (canvas.width / result.width);
      result.factorY = (canvas.height / result.height);
      checkMode();
      redraw();
    }
    img.onerror = function() {
      alert("Image failed to load!");
    }
    img.src = src;
  

  }
  if(location.href.match(/embed/)) {
    $("#hint").css('visibility', 'hidden');
  }
  if(location.href.match(/demo/)) {
    imageReceived(defaultData);
  } else {
    if(window.parent && window.parent != window) {
      window.parent.postMessage("imageDataRequest", '*');
    } else {
      imageReceived(defaultData);
    }
  }
  $(window).bind('message', function(event) {
    event = event.originalEvent;
    if(event.data.match(/^data:image/)) {
      imageReceived(event.data);
    } else if(event.data == 'imageDataRequest') {
      event.source.postMessage(canvas.toDataURL(), '*');
    } else {
      console.log("unrecognized message:");
      console.log(event.data);
    }
  });
  
  function checkMode() {
    $("a[href='#drag']").toggleClass('btn-primary', state.mode == 'drag');
    $("a[href='#crop']").toggleClass('btn-primary', state.mode == 'crop');
    $("#cropper").hide();
  }

  $("ul a").click(function(event) {
    event.preventDefault();
    var action = $(this).attr('href').substring(1);
    if(action == 'zoomin') {
      zoom('in');
    } else if(action == 'zoomout') {
      zoom('out');
    } else if(action == 'rotate') {
      rotate();
    } else if(action == 'grayscale') {
      colorize(0, 0, 0);
    } else if(action == 'reverse') {
      reverse();
    } else if(action == 'red') {
      colorize(150, 0, 0);
    } else if(action == 'blue') {
      colorize(0, 0, 150);
    } else if(action == 'green') {
      colorize(0, 150, 0);
    } else if(action == 'yellow') {
      colorize(150, 150, 0);
    } else if(action == 'orange') {
      colorize(150, 80, 0);
    } else if(action == 'purple') {
      colorize(80, 0, 150);
    } else if(action == 'reset') {
      reverse(false);
      colorize(null);
      $("a.color.btn-primary").removeClass('btn-primary');
    } else if(action == 'crop') {
      state.mode = 'crop';
      checkMode();
    } else if(action == 'drag') {
      state.mode = 'drag';
      checkMode();
    } else {
      alert(action + " not defined");
    }
    if($(this).hasClass('color')) {
      if($(this).hasClass('btn-primary')) {
        colorize(null);
        $("a.color.btn-primary").removeClass('btn-primary');
      } else {
        $("a.color.btn-primary").removeClass('btn-primary');
        $(this).addClass('btn-primary');
      }
    }
  });
  $("#pic").bind('mousedown touchdown', function(event) {
    if(event.button != null && event.button != 0) { return; }
    event.preventDefault();
    if(state.mode == 'drag') {
      state.dragging = {
        dragStartX: event.pageX,
        dragStartY: event.pageY,
        posStartX: state.posX,
        posStartY: state.posY
      };
    } else if(state.mode == 'crop') {
      state.cropping = {
        dragStartX: event.pageX,
        dragStartY: event.pageY,
        posStartX: state.posX,
        posStartY: state.posY
      }
    }
  });
  $(document).bind('mousemove touchmove', function(event) {
    if(state.dragging) {
      var diffX = event.pageX - state.dragging.dragStartX;
      var diffY = event.pageY - state.dragging.dragStartY;

      if(state.rotation == 0) {
        state.posX = state.dragging.posStartX + diffX;
        state.posY = state.dragging.posStartY + diffY;
      } else if(state.rotation == 90) {
        state.posX = state.dragging.posStartX + diffY;
        state.posY = state.dragging.posStartY - diffX;
      } else if(state.rotation == 180) {
        state.posX = state.dragging.posStartX - diffX;
        state.posY = state.dragging.posStartY - diffY;
      } else if(state.rotation == 270) {
        state.posX = state.dragging.posStartX - diffY;
        state.posY = state.dragging.posStartY + diffX;
      }
      enforcePositions();
      redraw();
    } else if(state.cropping) {
      $("#cropper").show()
      state.cropping.dragEndX = event.pageX;
      state.cropping.dragEndY = event.pageY;
      boundingBox(state.cropping);
    }
  }).bind('mouseup touchup', function(event) {
    stopDrag();
  }).bind('keydown', function(event) {
    if(event.keyCode == 27) {
      stopDrag(true);
    }
  });
  
  function stopDrag(cancel) {
    if(state.cropping && state.cropping.box && !cancel) {
      cropTo(state.cropping.box);
    }
    state.cropping = null;
    state.dragging = null;
    checkMode();
  }

  function boundingBox(cropping) {
    var offset = $("#pic").offset();
    var picMinX = Math.max(state.posX, 0) + offset.left;
    var picMinY = Math.max(state.posY, 0) + offset.top;
    var picWidth = (result.width * state.baseScaleX * state.zoom);
    var picHeight = (result.height * state.baseScaleY * state.zoom);
    var picMaxX = Math.min(state.posX + picWidth, result.width) + offset.left - 1;
    var picMaxY = Math.min(state.posY + picHeight, result.height) + offset.top - 1;
    var maxSize = Math.max(Math.abs(state.cropping.dragEndX - state.cropping.dragStartX), Math.abs(state.cropping.dragEndY - state.cropping.dragStartY));
    if(state.cropping.dragEndX < state.cropping.dragStartX) {
      if(state.cropping.dragEndY < state.cropping.dragStartY) {
        // top left
        maxSize = Math.min(maxSize, Math.abs(picMinY - state.cropping.dragStartY), Math.abs(picMinX - state.cropping.dragStartX));
      } else {
        // bottom left
        maxSize = Math.min(maxSize, Math.abs(picMaxY - state.cropping.dragStartY), Math.abs(picMinX - state.cropping.dragStartX));
      }
    } else {
      if(state.cropping.dragEndY < state.cropping.dragStartY) {
        // top right
        maxSize = Math.min(maxSize, Math.abs(picMinY - state.cropping.dragStartY), Math.abs(picMaxX - state.cropping.dragStartX));
      } else {
        // bottom right
        maxSize = Math.min(maxSize, Math.abs(picMaxY - state.cropping.dragStartY), Math.abs(picMaxX - state.cropping.dragStartX));
      }
    }
    var $cropper = $("#cropper");
    var x = state.cropping.dragStartX;
    var y = state.cropping.dragStartY;
    if(state.cropping.dragStartX > state.cropping.dragEndX) {
      x = state.cropping.dragStartX - maxSize;
    }
    if(state.cropping.dragStartY > state.cropping.dragEndY) {
      y = state.cropping.dragStartY - maxSize;
    }
    state.cropping.box = {
      x: (x - offset.left) * result.factorX,
      y: (y - offset.top) * result.factorY,
      size: maxSize
    }
    $cropper.css({
      'left': x,
      'top': y,
      'width': maxSize,
      'height': maxSize
    });
  }

  function cropTo(box) {
    var offset = $("#pic").offset();
    var pctOffsetX = (box.x - state.posX) / (result.width * state.baseScaleX * state.zoom);
    var pctOffsetY = (box.y - state.posY) / (result.height * state.baseScaleY * state.zoom);
    // Assumes a square canvas
    var pct = box.size / result.width;
    state.zoom = state.zoom / pct;
    state.scaleX = state.baseScaleX * state.zoom;
    state.scaleY = state.baseScaleY * state.zoom;
    var picWidth = (result.width * state.baseScaleX * state.zoom);
    var picHeight = (result.height * state.baseScaleY * state.zoom);
    state.posX = picWidth * pctOffsetX * -1;
    state.posY = picHeight * pctOffsetY * -1;
    redraw();
  }

  function enforcePositions() {
    var picWidth = (canvas.width * state.baseScaleX * state.zoom);
    var leftoverX = (canvas.width - picWidth) / 2;
    var minX = picWidth > canvas.width ? 0 : leftoverX;
    var maxX = picWidth > canvas.width ? (canvas.width - picWidth) : leftoverX;

    var picHeight = (canvas.height * state.baseScaleY * state.zoom);
    var leftoverY = (canvas.height - picHeight) / 2;
    var minY = picHeight > canvas.height ? 0 : leftoverY;
    var maxY = picHeight > canvas.height ? (canvas.height - picHeight) : leftoverY;
    state.posX = Math.max(Math.min(state.posX, minX), maxX);
    state.posY = Math.max(Math.min(state.posY, minY), maxY);
  }
  
  function rotate(action) {
    state.rotation = state.rotation || 0;
    state.rotation = (state.rotation + 90) % 360;
    if(action === false) { state.rotation = 0; }
    redraw();
  }

  function zoom(direction) {
    var zoomDelta = 0.5;
    var picWidth = (canvas.width * state.baseScaleX * state.zoom);
    var picHeight = (canvas.height * state.baseScaleY * state.zoom);
    var centerPctX = ((canvas.width / 2) - state.posX) / picWidth;
    var centerPctY = ((canvas.height / 2) - state.posY) / picHeight;
    if(direction == 'in') {
      state.zoom = state.zoom * (1 + zoomDelta);
      state.scaleX = state.baseScaleX * state.zoom;
      state.scaleY = state.baseScaleY * state.zoom;
      picWidth = (canvas.width * state.baseScaleX * state.zoom);
      picHeight = (canvas.height * state.baseScaleY * state.zoom);
      state.posX = (canvas.width / 2) - (picWidth * centerPctX);
      state.posY = (canvas.height / 2) - (picHeight * centerPctY);
    } else {
      state.zoom = Math.max(state.zoom / (1 + zoomDelta), 1.0);
      state.scaleX = state.baseScaleX * state.zoom, state.baseScaleX;
      state.scaleY = state.baseScaleY * state.zoom, state.baseScaleY;
      picWidth = (canvas.width * state.baseScaleX * state.zoom);
      picHeight = (canvas.height * state.baseScaleY * state.zoom);
      state.posX = (canvas.width / 2) - (picWidth * centerPctX);
      state.posY = (canvas.height / 2) - (picHeight * centerPctY);
    }
    enforcePositions();
    redraw();
  }

  function reverse(force) {
    state.reversed = (force === undefined) ? !state.reversed : force;
    $("a[href='#reverse']").toggleClass('btn-primary', !!state.reversed);
    redraw();
  }
  
  function colorize(r, g, b) {
    if(r != null) {
      state.color = {
        red: r,
        green: g,
        blue: b
      };
    } else {
      state.color = null;
    }
    redraw();
  }

  function redraw() {
    // console.log(state);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, state.posX, state.posY, canvas.width * state.scaleX, canvas.height * state.scaleY);
    
    if(state.color || state.reversed || state.rotation) {
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var pixels = imageData.data;
      
      var min_brightness = null, max_brightness = null, brightness_range = null;
      if(state.reversed) {
        for(var i = 0; i < pixels.length; i += 4) {
          var brightness = 0.34 * pixels[i] + 0.5 * pixels[i + 1] + 0.16 * pixels[i + 2];
          min_brightness = Math.min(min_brightness || brightness, brightness);
          max_brightness = Math.max(max_brightness || brightness, brightness);
        }
        // TODO: the code is flexible enough to handle 
        max_brightness = 255;
        min_brightness = 0;
        brightness_range = max_brightness - min_brightness;
        for(var i = 0; i < pixels.length; i += 4) {
          if(pixels[i + 3] < 255) {
            pixels[i] = (255 - pixels[i + 3]) + (pixels[i + 3] * (pixels[i] / 255));
            pixels[i + 1] = (255 - pixels[i + 3]) + (pixels[i + 3] * (pixels[i + 1] / 255));
            pixels[i + 2] = (255 - pixels[i + 3]) + (pixels[i + 3] * (pixels[i + 2] / 255));
          }
          pixels[i]     = ((1 - ((pixels[i] - min_brightness) / max_brightness)) * brightness_range) + min_brightness;
          pixels[i + 1] = ((1 - ((pixels[i + 1] - min_brightness) / max_brightness)) * brightness_range) + min_brightness;
          pixels[i + 2] = ((1 - ((pixels[i + 2] - min_brightness) / max_brightness)) * brightness_range) + min_brightness;
          pixels[i + 3] = 255;
        }
      }

      if(state.color) {
        for(var i = 0; i < pixels.length; i += 4) {
          var brightness = 0.34 * pixels[i] + 0.5 * pixels[i + 1] + 0.16 * pixels[i + 2];
          // red
          pixels[i] = Math.min(brightness + state.color.red, 255);
          // green
          pixels[i + 1] = Math.min(brightness + state.color.green, 255);
          // blue
          pixels[i + 2] = Math.min(brightness + state.color.blue, 255);
        }
      }
      
      var tmp_canvas = document.createElement('canvas');
      tmp_canvas.width = canvas.width;
      tmp_canvas.height = canvas.height;
      var tmp_context = tmp_canvas.getContext('2d');
      tmp_context.putImageData(imageData, 0, 0);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(state.rotation*Math.PI/180);
      context.translate(0 - (canvas.width / 2), 0 - (canvas.height / 2));
      // overwrite original image
      context.drawImage(tmp_canvas, 0, 0, canvas.width, canvas.height);
      context.restore();
    }
    try {
      $("#pic").attr('src', canvas.toDataURL());
    } catch(e) {
      alert("Image failed to load correctly. Some browsers do not support editing all types of images (such as .svg files).");
      console.log(e);
    }
  }
})();
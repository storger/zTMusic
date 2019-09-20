Vue.component("aplayer", VueAPlayer)
new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      currentPage: 1,
      isLastPage: false,
      searchValue: "周杰伦",
      muted: true,
      list: [
        {
          title: "说好不哭",
          artist: "周杰伦",
          src:
            "http://app.pd.nf.migu.cn/MIGUM2.0/v1.0/content/sub/listenSong.do?toneFlag=HQ&netType=00&userId=15548614588710179085069&ua=Android_migu&version=5.1&copyrightId=0&contentId=600907000009041435&resourceType=2&channel=1",
          pic:
            "https://d.musicapp.migu.cn/prod/file-service/file-down/4eedd78464c21ce789dea6928415b323/5a6d1615fbe05fc23eaa597b89bc8ac5/6cd348e7090ebd2322753f0ade1d5294"
        }
      ]
    }
  },
  methods: {
    searchSong() {
      this.loading = true
      fetch(
        `http://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?&ua=Android_migu&version=5.0.1&text=${encodeURI(
          this.searchValue
        )}&pageNo=${
          this.currentPage
        }&pageSize=20&searchSwitch={"song":1,"album":0,"singer":0,"tagSong":0,"mvSong":0,"songlist":0,"bestShow":1}`
      ).then(res=>res.json()).then(data => {
        this.loading = false
        this.list = data.songResultData.result.map(item => {
          return {
            title: item.name,
            artist: item.singers.map(v => v.name).join("&&"),
            src: this.getSongSrc(item.contentId),
            pic: item.imgItems[0].img,
            lrc: item.lyricUrl
          }
        })
        if (this.list.length < 20) {
          this.isLastPage = true
        }
      })
    },
    search() {
      if (!this.loading) {
        this.currentPage = 1
        this.searchSong()
      }
    },
    prePage() {
      if (1 !== this.currentPage && !this.loading) {
        this.currentPage = this.currentPage - 1
        this.searchSong()
      }
    },
    nextPage() {
      if (!this.isLastPage && !this.loading) {
        this.currentPage = this.currentPage + 1
        this.searchSong()
      }
    },
    getSongSrc(contentId) {
      // 无损 formatType = SQ resourceType = E
      // 高品 formatType = HQ resourceType = 2
      return `http://app.pd.nf.migu.cn/MIGUM2.0/v1.0/content/sub/listenSong.do?toneFlag=HQ&netType=00&userId=15548614588710179085069&ua=Android_migu&version=5.1&copyrightId=0&contentId=${contentId}&resourceType=2&channel=1`
    }
  },
  mounted() {
    this.searchSong()
  }
})

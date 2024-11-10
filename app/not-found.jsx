"use client";

import { useEffect } from "react";
import Link from "next/link";
import Parallax from "parallax-js";
import "./styleNotFound.scss";

export default function NotFound() {
  useEffect(() => {
    var scene = document.getElementById("scene");
    var parallax = new Parallax(scene);
  }, []);

  return (
    <div className="global overflow-hidden h-[100vh]">
      <div class="wrapper">
        <div class="container">
          <div id="scene" class="scene" data-hover-only="false">
            <div class="circle" data-depth="1.2"></div>

            <div class="one" data-depth="0.9">
              <div class="content">
                <span class="piece"></span>
                <span class="piece"></span>
                <span class="piece"></span>
              </div>
            </div>

            <div class="two" data-depth="0.60">
              <div class="content">
                <span class="piece"></span>
                <span class="piece"></span>
                <span class="piece"></span>
              </div>
            </div>

            <div class="three" data-depth="0.40">
              <div class="content">
                <span class="piece"></span>
                <span class="piece"></span>
                <span class="piece"></span>
              </div>
            </div>

            <p class="p404" data-depth="0.50">
              &emsp;&ensp;&nbsp;&nbsp;Halaman <br></br> Tidak Ditemukan
            </p>
            <p class="p404" data-depth="0.10">
              &emsp;&ensp;&nbsp;&nbsp;Halaman <br></br> Tidak Ditemukan
            </p>
          </div>

          <div class="text">
            <article>
              <p>
                Oppssss ... <br></br> Apa yang anda cari tidak ada, <br></br>{" "}
                kembalilah ke Halaman Utama !!!
              </p>
              <button>
                <Link href={"/dashboard"}>Kembali ke Halaman Utama</Link>
              </button>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

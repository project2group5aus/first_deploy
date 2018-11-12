import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
app.config['SQLALCHEMY_DATABASE_URI'] =  False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/schools_Austin_region.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Schools_Metadata = Base.classes.SchoolsAustin
Schools_Summary = Base.classes.SchoolsAustin


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/metadata/<campus_id>")
def school_metadata(campus_id):
    """Return the MetaData for a given campus_id."""
    sel = [
        Schools_Metadata.campus_id,
        Schools_Metadata.campus_name,
        Schools_Metadata.district,
        Schools_Metadata.enrollment,
        Schools_Metadata.pct_african_american,
        Schools_Metadata.pct_asian,
        Schools_Metadata.pct_hispanic,
        Schools_Metadata.pct_white,
        Schools_Metadata.pct_eco_dis,
        Schools_Metadata.pct_meets_grade_level_reading,
        Schools_Metadata.pct_meets_grade_level_math,
        Schools_Metadata.regional_rank,
        Schools_Metadata.elementary_school,
        Schools_Metadata.middle_school,
        Schools_Metadata.address,
        Schools_Metadata.zipcode,
        Schools_Metadata.phone,
        Schools_Metadata.student_teacher_ratio,
        Schools_Metadata.district,
        Schools_Metadata.county,
        Schools_Metadata.district_pct_meets_grade_level_reading,
        Schools_Metadata.district_pct_meets_grade_level_math,
        Schools_Metadata.state_pct_meets_grade_level_reading,
        Schools_Metadata.state_pct_meets_grade_level_math,
        Schools_Metadata.grade_range

    ]

    results = db.session.query(*sel).filter(Schools_Metadata.campus_id == campus_id).all()

    # Create a dictionary entry for each row of metadata information
    school_metadata = {}
    for result in results:
        school_metadata["campus_id"] = result[0]
        school_metadata["campus_name"] = result[1]
        school_metadata["district"] = result[2]
        school_metadata["enrollment"] = result[3]
        school_metadata["pct_african_american"] = result[4]
        school_metadata["pct_asian"] = result[5]
        school_metadata["pct_hispanic"] = result[6]
        school_metadata["pct_white"] = result[7]
        school_metadata["pct_eco_dis"] = result[8]
        school_metadata["pct_meets_grade_level_reading"] = result[9]
        school_metadata["pct_meets_grade_level_math"] = result[10]
        school_metadata["regional_rank"] = result[11]
        school_metadata["elementary_school"] = result[12]
        school_metadata["middle_school"] = result[13]
        school_metadata["address"] = result[14]
        school_metadata["zipcode"] = result[15]
        school_metadata["phone"] = result[16]
        school_metadata["student_teacher_ratio"] = result[17]
        school_metadata["district"] = result[18]
        school_metadata["county"] = result[19]
        school_metadata["district_pct_meets_grade_level_reading"] = result[20]
        school_metadata["district_pct_meets_grade_level_math"] = result[21]
        school_metadata["state_pct_meets_grade_level_reading"] = result[22]
        school_metadata["state_pct_meets_grade_level_math"] = result[23]
        school_metadata["grade_range"] = result[24]


    print(school_metadata)
    return jsonify(school_metadata)

@app.route("/schoolsummary/<campus_id>")
def school_summary(campus_id):
    """Return the data to populate into school summary panel"""
    sel = [
        Schools_Summary.campus_name,
        Schools_Summary.address,
        Schools_Summary.zipcode,
        Schools_Summary.phone,
        Schools_Summary.county,
        Schools_Summary.district,
        Schools_Summary.enrollment,
        Schools_Summary.grade_range,
        Schools_Summary.student_teacher_ratio,
        Schools_Summary.pct_eco_dis
    ]

    school_summary_results = db.session.query(*sel).filter(Schools_Summary.campus_id == campus_id).all()

    # Create a dictionary entry for each row of metadata information
    school_summary = {}
    for result in school_summary_results:
        school_summary["Campus Name"] = result[0]
        school_summary["Address"] = result[1]
        school_summary["Zipcode"] = result[2]
        school_summary["Phone Number"] = result[3]
        school_summary["County"] = result[4]
        school_summary["District"] = result[5]
        school_summary["Enrollment Size"] = result[6]
        school_summary["Grade Range"] = result[7]
        school_summary["Student/Teacher Ratio"] = result[8]
        school_summary["Pct Eco Dis"] = result[9]

    print("school_summary is....")
    print(school_summary)
    return jsonify(school_summary)


@app.route("/campusdashboard/<campus_id>")
def campusdashboard(campus_id):
    """Return the campusdashboard page."""
    return render_template("campusdashboard.html", campus_id=campus_id)

if __name__ == "__main__":
    app.run()
